const mongoose = require('mongoose')
const dotenv = require('dotenv')

const { app } = require('./src/app')

dotenv.config({ path: './config.env' })

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
})

const port = process.env.PORT || 3000

app.listen(port)
