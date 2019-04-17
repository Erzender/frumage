const errors = require('../errors')
const data = require('../data/_model')

exports.getProfile = async (req, res) => {
  let user = null
  try {
    user = await data.User.findByPk(req.params['id'])
    if (!user) {
      return res.status(404).send(errors.user_not_found)
    }
  } catch (err) {
    console.error(err)
    return res.status(503).send(errors.server_error)
  }
  return res.json({
    id: user.id,
    name: user.name,
    picture: user.picture,
    rank: user.rank
  })
}
