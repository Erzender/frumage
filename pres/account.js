const errors = require('../errors')
const data = require('../data/_model')

exports.getProfile = async (req, res) => {
  let user = null
  let group = null
  try {
    user = await data.User.findById(req.params['id'])
    if (!user) {
      return res.status(404).send(errors.user_not_found)
    }
    group = await user.getGroup()
    group = group ? group.dataValues.name : 'default'
  } catch (err) {
    console.error(err)
    return res.status(503).send(errors.server_error)
  }
  return res.json({
    id: user.id,
    name: user.name,
    picture: user.picture,
    group: group
  })
}
