const { Tour } = require('../models/tourModel')

const EARTH_RADIUS_IN_MILES = 3693.2
const EARTH_RADIUS_IN_KM = 6378.1
const KM_MULTIPLIER = 0.001
const MI_MULTIPLIER = 0.000621371

const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)
    res.status(200).send({
      tour,
    })
  } catch (err) {
    res.status(404).send({
      message: 'Tour not found',
    })
  }
}

const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body)
    res.status(201).send({
      tour: newTour,
    })
  } catch (err) {
    res.status(400).send({
      message: 'Error creating the tour. Please try again later',
    })
  }
}

const getAllTours = async (req, res) => {
  try {
    const queryObject = {
      ...req.query,
    }
    const excludedFields = ['page', 'sort', 'limit', 'fields']
    excludedFields.forEach(item => delete queryObject[item])
    let query = Tour.find(queryObject)

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ')
      query = query.sort(sortBy)
    } else {
      query = query.sort('-createdAt')
    }

    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ')
      query = query.select(fields) 
    }

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit

    query = query.skip(skip).limit(limit)

    if (req.query.page) {
      const toursCount = await Tour.countDocuments()
      if (skip >= toursCount) throw new Error('Page does not exist')
    }

    const tours = await query
    res.status(200).send({
      tours,
    })
  } catch (err) {
    res.status(404).send({
      message: 'Tours not found',
    })
  }
}

const updateTours = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      {
        new: true,
        runValidators: true,
      },
    )

    res.status(200).send({
      tour: updatedTour,
    })
  } catch (err) {
    res.status(404).send({
      message: 'Error updating the tour. Please try again later',
    })
  }
}

const deleteTour = async (req, res) => {
  try {
    const deletedTour = await Tour.findByIdAndDelete(req.params.id)
    res.status(200).send({
      tour: deletedTour,
    })
  } catch (err) {
    res.status(404).send({
      message: 'Error deleting the tour. Please try again later',
    })
  }
}

const getToursWithin = async (req, res) => {
  const {
    distance,
    center,
    unit,
  } = req.params
  const radius = unit === 'mi' 
    ? distance / EARTH_RADIUS_IN_MILES
    : distance / EARTH_RADIUS_IN_KM
  const [ lat, lng ] = center.split(',')
  try {
    const tours = await Tour.find({
      startLocation: {
        $geoWithin: {
          $centerSphere: [
            [lng, lat],
            radius,
          ]
        },
      },
    })
  
    res.status(200).send({
      tours,
    })
  } catch (err) {
    res.status(400).send({
      message: 'Error getting the tours within the distance',
    })
  } 
}

const getDistances = async (req, res) => {
  const {
    latlng,
    unit,
  } = req.params
  const [ lat, lng ] = latlng.split(',')
  const multiplier = unit === 'mi'
    ? MI_MULTIPLIER
    : KM_MULTIPLIER

  try {
    const distances = await Tour.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [Number(lng), Number(lat)],
          },
          distanceField: 'distance',
          distanceMultiplier: multiplier,
        },
      },
      {
        $project: {
          distance: 1,
          name: 1,
        },
      },
    ])

    res.status(200).send({
      distances,
    })
  } catch (err) {
    res.status(400).send({
      message: 'Distances cannot be get',
    })
  }
}

module.exports = {
  getTour,
  getAllTours,
  getToursWithin,
  getDistances,
  createTour,
  updateTours,
  deleteTour,
}
