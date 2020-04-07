const { Review } = require('../models/reviewModel')

const getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
    res.status(200).send({
      review,
    })
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
    res.status(200).send({
      reviews,
    })
  } catch (err) {
    res.status(404).send({
      message: 'There is no reviews for this tour',
    })
  }
}

const createReview = async (req, res) => {
  if (!req.body.tour) req.body.tour = req.params.tourId
  if (!req.body.user) req.body.user = req.user._id
  try {
    const newReview = await Review.create(req.body) 
    res.status(201).send({
      review: newReview,
    })
  } catch (err) {
    res.status(400).send({
      message: 'Error creating the review. Please try again later',
    })
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

    res.status(200).send({
      review: updatedReview,
    })
  } catch (err) {
    res.status(400).send({
      message: 'Error updating the review. Please try again later',
    })
  }
}

const deleteReview = async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id)
    res.status(200).send({
      review: deletedReview,
    })
  } catch (err) {
    res.status(404).send({
      message: 'Error deleting the review. Please try again later',
    })
  }
}

module.exports = {
  getReview,
  getAllReviews,
  createReview,
  updateReview,
  deleteReview,
}
