const mongoose = require('mongoose')

const { Tour } = require('./tourModel')

const DEFAULT_RATING = 4.5

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

reviewSchema.index({ tour: 1, user: 1 }, { unique: true })

reviewSchema.pre(/find^/, async function (next) {
  this.tour.populate({
    path: 'user',
    select: 'name photo',
  })
  next()
})

reviewSchema.statics.calcAverageRatings = async function (tour) {
  const stats = await this.aggregate([
    {
      $match: { tour },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    }
  ])

  if (stats.length) {
    await Tour.findByIdAndUpdate(tour, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    })
  } else {
    await Tour.findByIdAndUpdate(tour, {
      ratingsQuantity: 0,
      ratingsAverage: DEFAULT_RATING,
    })
  }
}

reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.tour)
})

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.tempReview = await this.findOne()
  next()
})

reviewSchema.post(/^findOneAnd/ , async function () {
  await this.tempReview.constructor.calcAverageRatings(this.tempReview.tour)
})

const Review = mongoose.model('Review', reviewSchema)

module.exports = {
  Review,
}
