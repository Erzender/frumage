const express = require('express')
const app = express()

const db = require('./data/_config')

app.get('/', (req, res) => res.send('Hello world'))

db.sequelize.sync().then(() => {
  app.listen(process.env.PORT || 8080)
})
