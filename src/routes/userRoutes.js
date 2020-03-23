const express = require('express')

const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../routeHandlers/userHandlers')
const { signUp, login } = require('../auth')

const userRouter = express.Router()

userRouter.route('/signup').post(signUp)
userRouter.route('/login').post(login)

userRouter.route('/').get(getAllUsers).post(createUser)

userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

module.exports = {
  userRouter
}
