const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: validator.isEmail, 
  },
  photo: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
  },
  passwordConfirm: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
  },
})

const User = mongoose.model('User', userSchema)

module.exports = {
  User,
}
