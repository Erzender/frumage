const data = require('../data/_model')
const errors = require('../errors')

exports.login = (req, res) => {
  res.send('nique')
}

exports.newAccount = async (req, res) => {
  if (!req.body || !req.body.name || !req.body.password) {
    return res.status(400).send(errors.missing_parameters)
  }
  try {
    data.User.create({
      name: req.body.name,
      password: req.body.password
    })
  } catch (err) {
    console.err(err)
    return res.status(503).send(errors.server_error)
  }
  return res.json({ success: true, message: 'Account created' })
}
