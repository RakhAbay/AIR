const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json({ extended: true }))

const { createProxyMiddleware } = require('http-proxy-middleware')

/*
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"],
    optionsSuccessStatus: 200
  })
);*/
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/classified', require('./routes/classified.routes'))
app.use('/api/user', require('./routes/user.routes'))
//app.use('/t', require('./routes/redirect.routes'))

const PORT = config.get('port') || 5000

async function start() {
  try {
    await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    app.listen(PORT, () => console.log(`App has been started on port ${PORT}`))
  } catch (e) {
    console.log('Server Error', e.message)
    process.exit(1)
  }
}

start()
