const fs = require('fs')
const path = require('path')

const dataDirPath = path.join(__dirname, '../dev-data/data/')

const simpleToursData = fs.readFileSync(`${dataDirPath}tours-simple.json`)

const getTour = (req, res) => {
  const { id } = req.params
  const tour = JSON.parse(simpleToursData).find(item => item.id === Number(id))
  console.log(tour)
  if(tour) {
    return res
      .status(200)
      .send(tour)
  }
  res.status(404).send('Tour not found')
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

module.exports = {
  getTour,
  getAllTours,
  createTour,
}
