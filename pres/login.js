const data = require('../data/_model')
const errors = require('../errors')
const bcrypt = require('bcrypt')

exports.login = async (req, res) => {
  if (!req.body || !req.body.name || !req.body.password) {
    return res.status(400).send(errors.missing_parameters)
  }
  try {
    let user = await data.User.findOne({ where: { name: req.body.name } })
    if (!user) {
      return res.status(404).send(errors.user_not_found)
    }
    let pass = await bcrypt.compare(req.body.password, user.dataValues.password)
    if (!pass) {
      return res.status(403).send('wrong_password')
    }
  } catch (err) {
    console.error(err)
    return res.status(503).send(errors.server_error)
  }
  return res.json({ success: true, message: 'logged in !' })
}

exports.newAccount = async (req, res) => {
  if (!req.body || !req.body.name || !req.body.password) {
    return res.status(400).send(errors.missing_parameters)
  }
  if (req.body.name.length < 1) {
    return res.status(400).send(errors.username_too_short)
  }
  if (req.body.password.length < 8) {
    return res.status(400).send(errors.password_too_short)
  }
  try {
    let hash = await bcrypt.hash(req.body.password, 10)
    await data.User.create({
      name: req.body.name,
      password: hash
    })
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(403).send(errors.username_taken)
    }
    console.error(err)
    return res.status(503).send(errors.server_error)
  }
  return res.json({ success: true, message: 'Account created' })
}
