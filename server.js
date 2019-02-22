const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const login = require('./pres/login')
const db = require('./data/_config')

app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Hello world'))

const routes = express.Router()

routes.post('/account', login.newAccount)

routes.get('*', (req, res) =>
  res.status(501).send('This is not the route you are looking for.')
)

app.use('/api', routes)

db.sequelize.sync().then(() => {
  app.listen(process.env.PORT || 8080)
})
