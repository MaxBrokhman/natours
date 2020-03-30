const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})

reviewSchema.pre(/find^/, async function (next) {
  this.tour.populate({
    path: 'user',
    select: 'name photo',
  })
  next()
})

const Review = mongoose.model('Review', reviewSchema)

module.exports = {
  Review,
}
