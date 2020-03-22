const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

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
    validate: {
      validator: function(passwordConfirm) {
        return passwordConfirm === this.password
      },
    },
  },
})

userSchema.pre('save', async function(next) {
  if (!this.isModified) return next()
  this.password = await bcrypt.hash(this.password, 12)
  this.passwordConfirm = undefined
  next()
})

const User = mongoose.model('User', userSchema)

module.exports = {
  User,
}
