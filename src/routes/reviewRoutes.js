const express = require('express')

const {
  getReview,
  getAllReviews,
  createReview,
  updateReview,
  deleteReview,
} = require('../routeHandlers/reviewHandlers')
const { protect, restrictTo } = require('../auth')

const reviewRouter = express.Router({ mergeParams: true })

reviewRouter.use(protect)

reviewRouter.route('/')
  .get(getAllReviews)
  .post(restrictTo('user'), createReview)

  reviewRouter
  .route('/:id')
  .get(getReview)
  .patch(restrictTo('user', 'admin'), updateReview)
  .delete(restrictTo('user', 'admin'), deleteReview)

module.exports = {
  reviewRouter,
}
