const handleError = (code, message) => (req, res) => {
  res.status(code).render('error', {
    title: 'Something went wrong',
    message: message || 'Please try again later',
  })
}

module.exports = {
  handleError,
}
