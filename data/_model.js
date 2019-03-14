const Sequelize = require('sequelize')
const db = require('./_config')

const User = db.sequelize.define('user', {
  password: Sequelize.STRING,
  picture: Sequelize.STRING,
  name: { type: Sequelize.STRING, unique: true },
  rank: Sequelize.STRING
})

const Topic = db.sequelize.define('topic', {
  name: Sequelize.STRING,
  description: Sequelize.TEXT,
  pinned: { type: Sequelize.BOOLEAN, defaultValue: false },
  read: Sequelize.STRING,
  write: Sequelize.STRING
})

const Thread = db.sequelize.define('thread', {
  name: Sequelize.STRING,
  description: Sequelize.TEXT
})

const Message = db.sequelize.define('message', {
  content: Sequelize.TEXT
})

Message.belongsTo(Thread)
Thread.belongsTo(Topic)
Topic.hasMany(Thread)
Thread.hasMany(Message)
Message.hasOne(User, { as: 'Author' })
Thread.hasOne(User, { as: 'Author' })

exports.User = User
exports.Topic = Topic
exports.Thread = Thread
exports.Message = Message
