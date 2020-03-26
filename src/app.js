const express = require('express')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xssClean = require('xss-clean')
const hpp = require('hpp')

const { tourRouter } = require('./routes/tourRoutes')
const { userRouter } = require('./routes/userRoutes')

const app = express()

const limiter = rateLimit({
  max: 100,
  windowMs: 3600000,
  message: 'Too many requests from this IP, please try again in an hour',
})

app.use(helmet())
app.use('/api', limiter)

app.use(express.json({ limit: '10kb' }))
app.use(express.static(`${__dirname}/../public`))

app.use(mongoSanitize())
app.use(xssClean())
app.use(hpp({
  whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'price', 'maxGroupSize', 'difficulty'],
}))

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

module.exports = {
  app,
}
