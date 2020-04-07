const express = require('express')

const {
  getLogin,
  getOverview,
  getTour,
  getAccount,
} = require('../routeHandlers/viewHandlers')
const { isLoggedIn, protect } = require('../auth')

const viewRouter = express.Router()

viewRouter.get('/', isLoggedIn, getOverview)
viewRouter.get('/overview', isLoggedIn, getOverview)
viewRouter.get('/tour/:id', isLoggedIn, getTour)
viewRouter.get('/login', isLoggedIn, getLogin)
viewRouter.get('/me', protect, getAccount)

module.exports = {
  viewRouter,
}
