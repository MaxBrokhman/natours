const { Review } = require('../models/reviewModel')

const getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
    res.status(200).send(review)
  } catch (err) {
    res.status(404).send(err)
  }
}

const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
    res.status(200).send(reviews)
  } catch (err) {
    res.status(404).send(err)
  }
}

const createReview = async (req, res) => {
  try {
    const newReview = await Review.create(req.body) 
    res.status(201).send(newReview)
  } catch (err) {
    res.status(400).send(err)
  }
}

module.exports = {
  getReview,
  getAllReviews,
  createReview,
}
