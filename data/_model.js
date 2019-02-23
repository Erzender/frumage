const Sequelize = require('sequelize')
const db = require('./_config')

const User = db.sequelize.define('user', {
  password: Sequelize.STRING,
  picture: Sequelize.STRING,
  name: { type: Sequelize.STRING, unique: true }
})

const Group = db.sequelize.define('group', {
  name: { type: Sequelize.STRING, unique: true }
})

const Topic = db.sequelize.define('topic', {
  name: Sequelize.STRING,
  description: Sequelize.TEXT
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
Topic.hasOne(Group, { as: 'Restriction' })
Topic.hasMany(Thread)
Thread.hasMany(Message)
Message.hasOne(User, { as: 'Author' })
Thread.hasOne(User, { as: 'Author' })
User.belongsTo(Group)
Group.hasOne(Group, { as: 'Inheritence' })

exports.User = User
exports.Topic = Topic
exports.Thread = Thread
exports.Message = Message
