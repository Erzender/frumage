const errors = require('../errors')
const data = require('../data/_model')

exports.getTopics = async (req, res) => {
  let topics = null
  let group = req.decoded ? req.decoded.group : 'default'
  try {
    topics = await data.Topic.findAll()
    topics = topics.map(topic => {
      return { ...topic.dataValues }
    })
  } catch (err) {
    return res.status(503).send(errors.server_error)
  }
}
