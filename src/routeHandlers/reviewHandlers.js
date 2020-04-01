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
  const filterObj = req.params.tourId
    ? { tour: req.params.tourId }
    : {}
  try {
    const reviews = await Review.find(filterObj)
    res.status(200).send(reviews)
  } catch (err) {
    res.status(404).send(err)
  }
}

const createReview = async (req, res) => {
  if (!req.body.tour) req.body.tour = req.params.tourId
  if (!req.body.user) req.body.user = req.user._id
  try {
    const newReview = await Review.create(req.body) 
    res.status(201).send(newReview)
  } catch (err) {
    res.status(400).send(err)
  }
}

const updateReview = async (req, res) => {
  try {
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      {
        new: true,
        runValidators: true,
      },
    )

    res.status(200).send(updatedReview)
  } catch (err) {
    res.status(404).send(err)
  }
}

const deleteReview = async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id)
    res.status(200).send(deletedReview)
  } catch (err) {
    res.status(404).send(err)
  }
}

module.exports = {
  getReview,
  getAllReviews,
  createReview,
  updateReview,
  deleteReview,
}
