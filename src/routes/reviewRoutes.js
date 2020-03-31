const express = require('express')

const {
  getReview,
  getAllReviews,
  createReview,
} = require('../routeHandlers/reviewHandlers')
const { protect, restrictTo } = require('../auth')

const reviewRouter = express.Router({ mergeParams: true })

reviewRouter.route('/')
  .get(getAllReviews)
  .post(
    protect, 
    restrictTo('user'), 
    createReview,
  )

  reviewRouter
  .route('/:id')
  .get(getReview)

module.exports = {
  reviewRouter
}
