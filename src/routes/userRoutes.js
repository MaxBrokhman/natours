const express = require('express')
const multer = require('multer')

const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  resizeUserPhoto,
} = require('../routeHandlers/userHandlers')
const { 
  signUp, 
  login,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
} = require('../auth')

const userRouter = express.Router()

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users')
//   },
//   filename: (req, file, cb) => {
//     const extension = file.mimetype.split('/')[1]
//     cb(null, `user-${req.user._id}-${Date.now()}.${extension}`)
//   },
// })
const multerFilter = (req, file, cb) => 
  file.mimetype.startsWith('image') 
    ? cb(null, true) 
    : cb(null, false)

const upload = multer({ 
  storage: multer.memoryStorage(),
  fileFilter: multerFilter,
})

userRouter.route('/signup').post(signUp)
userRouter.route('/login').post(login)
userRouter.route('/logout').get(logout)
userRouter.route('/forgotPassword').post(forgotPassword)
userRouter.route('/resetPassword/:token').patch(resetPassword)

userRouter.route('/updateMyPassword').patch(protect, updatePassword)
userRouter.route('/updateProfile').patch(
  protect, 
  upload.single('photo'), 
  resizeUserPhoto,
  updateUser,
)
userRouter.route('/deleteProfile').delete(protect, deleteUser)

userRouter.route('/').get(getAllUsers).post(protect, createUser)

userRouter.route('/me').get(protect, getUser)

module.exports = {
  userRouter,
}
