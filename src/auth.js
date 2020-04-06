const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const { User } = require('./models/userModel')
const { sendEmail } = require('./email')

const signToken = id => (
  jwt.sign(
    { id }, 
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  )
)

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id)
  const cookieOptions = {
    expires: new Date(Date.now() + Number(process.env.JWT_COOKIE_EXPIRES_IN)),
    // secure: true,
    httpOnly: true,
  }
  res.cookie('jwt', token, cookieOptions)
  user.token = token
  user.password = undefined
  res.status(statusCode).send(user)
}

const isPasswordsEqual = async (inputed, hashed) => (
  await bcrypt.compare(inputed, hashed)
)

const signUp = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      photo: req.body.photo,
    })
    createSendToken(newUser, 201, res)
    next()
  } catch (err) {
    res.status(400).send(err)
  }
}

const login = async (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400).send('Please provide email and password')
    return next()
  }
  try {
    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await isPasswordsEqual(password, user.password))) {
      res.status(401).send({
        message: 'Incorrect email or password',
      })
      return next()
    }
    createSendToken(user, 200, res)
  } catch (err) {
    res.status(400).send(err)
    next()
  }
}

const protect = async (req, res, next) => {
  try {
    const headerToken = req.header('Authorization').replace('Bearer ', '')
    const token = headerToken 
      ? headerToken 
      : req.cookies.jwt
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const existentUser = await User.findById(decoded.id)
    if (!existentUser) {
      res.status(401).send('User does not exist')
      return next()
    }

    if (existentUser.changedPassword(decoded.iat)) {
      res.status(401).send('Password was changed. Please log in')
      return next()
    }
    req.user = existentUser
    next()

  } catch (err) {
    res.status(401).send('Please authentificate')
    next()
  }
}

const isLoggedIn = async (req, res, next) => {
  const token = req.cookies && req.cookies.jwt
  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const existentUser = await User.findById(decoded.id)
    if (!existentUser) return next()
    if (existentUser.changedPassword(decoded.iat)) return next()
    res.locals.user = existentUser
    return next()
  } 
  next()
}

const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    res.status(403).send('You do not have permission to perform this action')
    return next()
  }
  next()
}

const forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    res.status(404).send('User with such email does not exist')
    return next()
  }

  const resetToken = User.createPasswordResetToken()
  await user.save({ validateBeforeSave: false })

  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`

  const message = `Forgot your password? Submit a new one: ${resetURL}`

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset',
      message,
    })
    res.status(200).send('Reset token has been sent')
    
  } catch (err) {
    user.createPasswordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save({ validateBeforeSave: false })
    res.status(500).send('There was an error with sending email. Please try again later.')
  }
  next()
}

const resetPassword = async (req, res, next) => {
  const hashedToken = crypto
                        .createHash('sha256')
                        .update(req.params.token)
                        .digest('hex')
  const user = await User.findOne({
     passwordResetToken: hashedToken,
     passwordResetExpires: { $gt: Date.now() },
  })
  if (!user) {
    res.status(400).send('Token is invalid or expired')
    return next()
  }
  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined
  await user.save()

  createSendToken(user, 200, res)
}

const updatePassword = async (req, res, next) => {
  const user = await User.findById(req.user._id).select('+password')
    if (!user || !(await isPasswordsEqual(req.body.passwordCurrent, user.password))) {
      res.status(401).send('Incorrect password')
      return next()
    }

    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm

    await user.save()

    createSendToken(user, 200, res)
}

module.exports = {
  signUp,
  login,
  isLoggedIn,
  protect,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
}
