const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const { User } = require('./models/userModel')

const signToken = id => (
  jwt.sign(
    { id }, 
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  )
)

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
    const token = signToken(newUser._id)
    newUser.token = token
    res.status(201).send(newUser)
    next()
  } catch (err) {
    res.status(400).send(err)
  }
}

const login = async (req, res, next) => {
  const { email, password} = req.body
  if (!email || !password) {
    res.status(400).send('Please provide email and password')
    return next()
  }
  try {
    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await isPasswordsEqual(password, user.password))) {
      res.status(401).send('Incorrect email or password')
      return next()
    }
    const token = signToken(user._id)
    res.status(200).send(token)
  } catch (err) {
    res.status(400).send(err)
  }
}

const protect = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
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

module.exports = {
  signUp,
  login,
  protect,
}
