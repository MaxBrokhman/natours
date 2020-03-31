const express = require('express')

const {
  getTour,
  getAllTours,
  createTour,
  deleteTour, 
  updateTours,
} = require('../routeHandlers/tourHandlers')
const { protect, restrictTo } = require('../auth')
const { reviewRouter } = require('./reviewRoutes')

const tourRouter = express.Router()

tourRouter.use('/:tourId/reviews', reviewRouter)

tourRouter.route('/')
  .get(protect, getAllTours)
  .post(createTour)

tourRouter
  .route('/:id')
  .get(getTour)
  .patch(updateTours)
  .delete(
    protect, 
    restrictTo('admin', 'lead-guide'), 
    deleteTour,
  )

module.exports = {
  tourRouter
}
