const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

const db = require('./data/_config')
const dbInit = require('./data/_init')
const config = require('./utils/loadConfig')

const login = require('./pres/login')
const account = require('./pres/account')
const topics = require('./pres/topics')
const threads = require('./pres/threads')
const messages = require('./pres/messages')

app.use(bodyParser.json())
app.use(cors())
app.set('superSecret', process.env.SECRET || config.SECRET)

app.get('/', (req, res) => res.send('The service is running on /api'))

const routes = express.Router()

routes.post('/account', login.newAccount)
routes.post('/login', login.login)

routes.use(login.tokenValidation)

routes.get('/profile/:id', account.getProfile)
routes.get('/topics', topics.getTopics)
routes.post('/topic', topics.newTopic)
routes.post('/thread', threads.newThread)
routes.get('/threads', threads.getThreads)
routes.post('/message', messages.newMessage)
routes.get('/messages', messages.getMessages)

routes.get('*', (req, res) =>
  res.status(501).send('This is not the route you are looking for.')
)

app.use('/api', routes)

db.sequelize.sync().then(() => {
  dbInit().then(start => {
    if (start) {
      app.listen(process.env.PORT || 8080)
    }
  })
})
