const express = require('express')

const {
  getTour,
  getAllTours,
  createTour,
} = require('../routeHandlers/tourHandlers')

const tourRouter = express.Router()

tourRouter.route('/')
  .get(getAllTours)
  .post(createTour)

tourRouter.route('/:id').get(getTour)

module.exports = {
  tourRouter
}
