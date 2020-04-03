const { Tour } = require('../models/tourModel')

const getOverview = async (req, res) => {
  const tours = await Tour.find()
  res.status(200).render('overview', {
    title: 'All tours',
    tours,
  })
}

const getTour = async (req, res) => {
  const { id } = req.params
  const tour = await Tour.findById(id).populate({
    path: 'reviews',
    fields: 'review rating user',
  })
  res.status(200).render('tour', {
    title: tour.name,
    tour,
  })
}

module.exports = {
  getOverview,
  getTour,
}
