const { Tour } = require('../models/tourModel')

const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)
    res.status(200).send(tour)
  } catch (err) {
    res.status(404).send(err)
  }
}

const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body)
    res.status(201).send(newTour)
  } catch (err) {
    res.status(400).send(err)
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
    res.status(200).send(tours)
  } catch (err) {
    res.status(404).send(err)
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

    res.status(200).send(updatedTour)
  } catch (err) {
    res.status(404).send(err)
  }
}

const deleteTour = async (req, res) => {
  try {
    const deletedTour = await Tour.findByIdAndDelete(req.params.id)
    res.status(200).send(deletedTour)
  } catch (err) {
    res.status(404).send(err)
  }
}

module.exports = {
  getTour,
  getAllTours,
  createTour,
  deleteTour,
}
