const data = require('../data/_model')
const errors = require('../errors')
const bcrypt = require('bcrypt')

exports.login = (req, res) => {
  res.send('nique')
}

exports.newAccount = async (req, res) => {
  if (!req.body || !req.body.name || !req.body.password) {
    return res.status(400).send(errors.missing_parameters)
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
