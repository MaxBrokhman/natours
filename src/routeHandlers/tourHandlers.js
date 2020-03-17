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
    const allTours = Tour.find()
    res.status(200).send(allTours)
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
