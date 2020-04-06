const express = require('express')

const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../routeHandlers/userHandlers')
const { 
  signUp, 
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
} = require('../auth')

const userRouter = express.Router()

userRouter.route('/signup').post(signUp)
userRouter.route('/login').post(login)
userRouter.route('/forgotPassword').post(forgotPassword)
userRouter.route('/resetPassword/:token').patch(resetPassword)

userRouter.route('/updateMyPassword').patch(protect, updatePassword)
userRouter.route('/updateProfile').patch(protect, updateUser)
userRouter.route('/deleteProfile').delete(protect, deleteUser)

userRouter.route('/').get(getAllUsers).post(protect, createUser)

userRouter.route('/me').get(protect, getUser)

module.exports = {
  userRouter,
}
