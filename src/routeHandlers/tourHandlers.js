const fs = require('fs')
const path = require('path')

const dataDirPath = path.join(__dirname, '../dev-data/data/')

const simpleToursData = fs.readFileSync(`${dataDirPath}tours-simple.json`)

const getTour = (req, res) => {
  res
    .status(200)
    .send(req.tour)
}

const createTour = (req, res) => {
  const newId = +simpleToursData[simpleToursData.length - 1].id + 1
  const newTour = {
    ...req.body,
    id: newId
  }
  simpleToursData.push(newTour)
  
  fs.writeFile(`${dataDirPath}tours-simple.json`, JSON.stringify(simpleToursData), (err) => {
    res.status(201).send(JSON.stringify(newTour))
  })
}

const getAllTours = (req, res) => {
  res
    .status(200)
    .send(simpleToursData)
}

const checkTour = (req, res, next, value) => {
  const tour = JSON.parse(simpleToursData).find(item => item.id === Number(value))
  if(!tour) {
    return res.status(404).send('Tour not found')
  }
  req.tour = tour
  next()
}

const checkBody = (req, res, next) => {
  if(!req.body.name || !req.body.price){
    return res
      .status(400)
      .send('Request should contain name and price properties')
  }
  next()
}

module.exports = {
  getTour,
  getAllTours,
  createTour,
  checkTour,
  checkBody,
}
