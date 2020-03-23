const express = require('express')

const {
  getTour,
  getAllTours,
  createTour,
} = require('../routeHandlers/tourHandlers')
const { protect } = require('../auth')

const tourRouter = express.Router()

tourRouter.route('/')
  .get(protect, getAllTours)
  .post(createTour)

tourRouter.route('/:id').get(getTour)

module.exports = {
  tourRouter
}
