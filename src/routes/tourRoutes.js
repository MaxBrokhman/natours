const express = require('express')

const {
  getTour,
  getAllTours,
  createTour,
  checkTour,
  checkBody,
} = require('../routeHandlers/tourHandlers')

const tourRouter = express.Router()

tourRouter.param('id', checkTour)

tourRouter.route('/')
  .get(getAllTours)
  .post(checkBody, createTour)

tourRouter.route('/:id').get(getTour)

module.exports = {
  tourRouter
}
