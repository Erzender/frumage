const Op = require('sequelize').Op

const errors = require('../errors')
const data = require('../data/_model')
const permissions = require('../utils/permissions')
const config = require('../utils/loadConfig')

exports.getTopics = async (req, res) => {
  let user = null
  let admin = false
  let rank = config.ranks[0] || null
  if (req.decoded) {
    try {
      user = await data.User.findByPk(req.decoded.id)
      rank = user.dataValues.rank
      admin = rank === config.ranks.length - 1
    } catch (err) {
      console.error(err)
      return res.status(503).send(errors.server_error)
    }
  }
  let topics = null
  try {
    if (admin) {
      topics = await data.Topic.findAll()
    } else {
      topics = await data.Topic.findAll({
        where: {
          read: {
            [Op.in]: permissions.getLowerRanks(rank)
          }
        }
      })
    }
  } catch (err) {
    console.error(err)
    return res.status(503).send(errors.server_error)
  }
  return res.json({
    success: true,
    topics: topics.map(topic => ({
      id: topic.dataValues.id,
      name: topic.dataValues.name,
      description: topic.dataValues.description
    }))
  })
}

exports.newTopic = async (req, res) => {
  if (!req.decoded) {
    return res.status(403).send(errors.not_logged_in)
  }
  let topic = null
  let user = null
  if (
    !req.body.name ||
    !req.body.description ||
    !req.body.read ||
    !req.body.write
  ) {
    return res.status(400).send(errors.missing_parameters)
  }
  try {
    user = await data.User.findByPk(req.decoded.id)
    if (
      permissions.sub(user.dataValues.rank, req.body.read) < 0 ||
      permissions.sub(user.dataValues.rank, req.body.write) < 0
    ) {
      return res.status(403).send(errors.denied)
    }
    if (permissions.checkPerm('create_topics', user.dataValues.rank)) {
      topic = await data.Topic.create({
        name: req.body.name,
        description: req.body.description,
        read: req.body.read,
        write: req.body.write
      })
      return res.json({ success: true, topicId: topic.dataValues.id })
    }
    return res.status(403).send(errors.denied)
  } catch (err) {
    console.log(err)
    return res.status(503).send(errors.server_error)
  }
}
