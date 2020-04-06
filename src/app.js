const express = require('express')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xssClean = require('xss-clean')
const hpp = require('hpp')
const path = require('path')
const cookieParser = require('cookie-parser')

const { tourRouter } = require('./routes/tourRoutes')
const { userRouter } = require('./routes/userRoutes')
const { reviewRouter } = require('./routes/reviewRoutes')
const { viewRouter } = require('./routes/viewRoutes')
const { handleError } = require('./routeHandlers/errorHandlers')

const app = express()

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, '../public')))

const limiter = rateLimit({
  max: 100,
  windowMs: 3600000,
  message: 'Too many requests from this IP, please try again in an hour',
})

app.use(helmet())
app.use('/api', limiter)
app.use(express.json({ limit: '10kb' }))
app.use(cookieParser())

app.use(mongoSanitize())
app.use(xssClean())
app.use(hpp({
  whitelist: [
    'duration', 
    'ratingsQuantity', 
    'ratingsAverage', 
    'price', 
    'maxGroupSize', 
    'difficulty',
  ],
}))

app.use('/', viewRouter)
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/reviews', reviewRouter)

app.all('*', handleError(404, 'Page not found'));

module.exports = {
  app,
}
