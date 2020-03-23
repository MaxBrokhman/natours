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
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
    select: false,
    validate: {
      validator: function(passwordConfirm) {
        return passwordConfirm === this.password
      },
    },
  },
  passwordChangedAt: Date,
})

userSchema.pre('save', async function(next) {
  if (!this.isModified) return next()
  this.password = await bcrypt.hash(this.password, 12)
  this.passwordConfirm = undefined
  next()
})

userSchema.methods.changedPassword = function(time) {
  if (this.passwordChangedAt) {
    const changeTime = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    )  
    return changeTime > time
  }
  return false
}

const User = mongoose.model('User', userSchema)

module.exports = {
  User,
}
