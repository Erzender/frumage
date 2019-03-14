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
  } catch (err) {
    console.log(err)
    return res.status(503).send(errors.server_error)
  }
  res.json({ success: true })
}
