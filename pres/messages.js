const errors = require('../errors')
const data = require('../data/_model')
const permissions = require('../utils/permissions')
const config = require('../utils/loadConfig')
const moment = require('moment')

exports.newMessage = async (req, res) => {
  if (!req.decoded) {
    return res.status(403).send(errors.not_logged_in)
  }
  if (!req.body.thread || !req.body.content) {
    return res.status(400).send(errors.missing_parameters)
  }
  let user = null
  let thread = null
  let message = null
  let topic = null
  try {
    user = await data.User.findByPk(req.decoded.id)
    thread = await data.Thread.findByPk(req.body.thread)
    if (thread === null) {
      return res.status(404).send(errors.thread_not_found)
    }
    topic = await thread.getTopic()
    if (permissions.sub(user.dataValues.rank, req.body.write) < 0) {
      return res.status(403).send(errors.denied)
    }
    message = await data.Message.create({ content: req.body.content })
    message.setAuthor(user)
    thread.addMessage(message)
  } catch (err) {
    console.log(err)
    return res.status(503).send(errors.server_error)
  }
  return res.json({ success: true, message: message.dataValues.id })
}

exports.getMessages = async (req, res) => {
  let threadId = req.headers['thread']
  if (!threadId) {
    return res.status(400).send(errors.missing_parameters)
  }
  let user = null
  let admin = false
  let rank = config.ranks[0] || null
  let thread = null
  let topic = null
  let messages = null
  if (req.decoded) {
    try {
      user = await data.User.findByPk(req.decoded.id)
      rank = user.dataValues.rank
      admin = rank === config.ranks.length - 1
    } catch (err) {
      console.log(err)
      return res.status(503).send(errors.server_error)
    }
    try {
      thread = await data.Thread.findByPk(threadId)
      topic = await thread.getTopic()
      if (
        !admin &&
        permissions.sub(user.dataValues.rank, topic.dataValues.read) < 0
      ) {
        return res.status(403).send(errors.denied)
      }
      messages = await thread.getMessages()
      messages = messages
        .sort((a, b) =>
          moment(a.dataValues.createdAt).diff(b.dataValues.createdAt, 'seconds') < 0
        )
        .map(message => ({ ...message.dataValues }))
    } catch (err) {
      console.log(err)
      return res.status(503).send(errors.server_error)
    }
  }
  return res.json({ success: true, messages: messages })
}
