const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

const db = require('./data/_config')
const config = require('./utils/loadConfig')

const login = require('./pres/login')
const account = require('./pres/account')
const topics = require('./pres/topics')
const threads = require('./pres/threads')

app.use(bodyParser.json())
app.use(cors())
app.set('superSecret', process.env.SECRET || config.SECRET)

app.get('/', (req, res) => res.send('Hello world'))

const routes = express.Router()

routes.post('/account', login.newAccount)
routes.post('/login', login.login)

routes.use(login.tokenValidation)

routes.get('/profile/:id', account.getProfile)
routes.get('/topics', topics.getTopics)
routes.post('/topic', topics.newTopic)
routes.post('/thread', threads.newThread)

routes.get('*', (req, res) =>
  res.status(501).send('This is not the route you are looking for.')
)

app.use('/api', routes)

db.sequelize.sync().then(() => {
  app.listen(process.env.PORT || 8080)
})
