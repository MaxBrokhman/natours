const express = require('express')

const {
  becomeLogout,
  getLogin,
  getOverview,
  getTour,
} = require('../routeHandlers/viewHandlers')
const { isLoggedIn } = require('../auth')

const viewRouter = express.Router()

viewRouter.get('/logout', becomeLogout)

viewRouter.use(isLoggedIn)

viewRouter.get('/', getOverview)
viewRouter.get('/overview', getOverview)
viewRouter.get('/tour/:id', getTour)
viewRouter.get('/login', getLogin)

module.exports = {
  viewRouter,
}
