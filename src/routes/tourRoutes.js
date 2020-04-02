const express = require('express')

const {
  getTour,
  getAllTours,
  getToursWithin,
  getDistances,
  createTour,
  deleteTour, 
  updateTours,
} = require('../routeHandlers/tourHandlers')
const { protect, restrictTo } = require('../auth')
const { reviewRouter } = require('./reviewRoutes')

const tourRouter = express.Router()

tourRouter.route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin)

tourRouter.route('/distances/:latlng/unit/:unit')
  .get(getDistances)

tourRouter.use('/:tourId/reviews', reviewRouter)

tourRouter.route('/')
  .get(protect, getAllTours)
  .post(
    protect, 
    restrictTo('admin', 'lead-guide'), 
    createTour,
  )

tourRouter
  .route('/:id')
  .get(getTour)
  .patch(
    protect, 
    restrictTo('admin', 'lead-guide'),
    updateTours,
  )
  .delete(
    protect, 
    restrictTo('admin', 'lead-guide'), 
    deleteTour,
  )

module.exports = {
  tourRouter
}
