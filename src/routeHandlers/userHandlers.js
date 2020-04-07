const { User } = require('../models/userModel')

const getAllUsers = (req, res) => {
  res.send(500).send({
    message: 'this route not yet implemented',
  })
}

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    res.status(200).send({
      user,
    })
  } catch (err) {
    res.status(404).send({
      message: 'User not found',
    })
  }
}

const createUser = (req, res) => {
  res.send(500).send({
    message: 'this route not yet implemented',
  })
}

const filterObj = (obj, ...allowedFields) => {
  const newObj = {}
  Object.keys(obj).forEach(key => {
    if (allowedFields.includes(key)) {
      newObj[key] = obj[key]
    }
  })
  return newObj
}

const updateUser = async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    res.status(400).send({
      message: 'This route is not for password update',
    })
    return next()
  }

  const filteredBody = filterObj(req.body, 'name', 'email')

  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  })

  res.status(200).send({
    user: updatedUser,
  })
}

const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { active: false })
    res.status(204).send()
  } catch (err) {
    res.status(400).send({
      message: 'Error deleting the user. Please try again later',
    })
  }
}

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
}
