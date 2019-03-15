const errors = require('../errors')
const data = require('../data/_model')
const permissions = require('../utils/permissions')

exports.newThread = async (req, res) => {
  if (!req.decoded) {
    return res.status(403).send(errors.not_logged_in)
  }
  let topic = null
  let thread = null
  let user = null
  if (!req.body.topic || !req.body.name || !req.body.description) {
    return res.status(400).send(errors.missing_parameters)
  }
  try {
    user = await data.User.findByPk(req.decoded.id)
    topic = await data.Topic.findByPk(req.body.topic)
    if (permissions.sub(user.dataValues.rank, topic.dataValues.write) < 0) {
      return res.status(403).send(errors.denied)
    }
    thread = await data.Thread.create({
      name: req.body.name,
      description: req.body.description
    })
    await topic.addThread(thread)
  } catch (err) {
    console.log(err)
    return res.status(503).send(errors.server_error)
  }
  return res.json({ success: true, thread: thread.dataValues.id })
}

exports.getThreads = async (req, res) => {
  if (!req.decoded) {
    return res.status(403).send(errors.not_logged_in)
  }
  let user = null
  let threads = null
  let topic = req.headers['topic']
  if (!topic) {
    return res.status(400).send(errors.missing_parameters)
  }
  try {
    user = await data.User.findByPk(req.decoded.id)
    topic = await data.Topic.findByPk(topic)
    if (permissions.sub(user.dataValues.rank, topic.dataValues.read) < 0) {
      return res.status(403).send(errors.denied)
    }
    threads = await topic.getThreads()
  } catch (err) {
    console.log(err)
    return res.status(503).send(errors.server_error)
  }
  return res.json({ success: true, threads })
}
