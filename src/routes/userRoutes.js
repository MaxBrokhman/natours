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

userRouter.use(protect)

userRouter.route('/updateMyPassword').patch(updatePassword)
userRouter.route('/updateProfile').patch(updateUser)
userRouter.route('/deleteProfile').delete(deleteUser)

userRouter.route('/').get(getAllUsers).post(createUser)

userRouter.route('/me').get(getUser)

module.exports = {
  userRouter,
}
