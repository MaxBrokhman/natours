const express = require('express')

const {
  getOverview,
  getTour,
} = require('../routeHandlers/viewHandlers')

const viewRouter = express.Router()

viewRouter.get('/', getOverview)
viewRouter.get('/overview', getOverview)
viewRouter.get('/tour/:id', getTour)

module.exports = {
  viewRouter,
}
