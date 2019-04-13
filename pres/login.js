const jwt = require('jsonwebtoken')
const Joi = require('@hapi/joi')

const data = require('../data/_model')
const errors = require('../errors')
const bcrypt = require('bcrypt')

const signupSchema = Joi.object().keys({
  name: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/)
})

exports.tokenValidation = async (req, res, next) => {
  let token = req.headers['token']
  let decoded = null
  if (!token) {
    next()
  }
  try {
    decoded = jwt.verify(token, req.app.get('superSecret'))
  } catch (err) {
    if (err.message === 'invalid signature' || err.message === 'jwt expired') {
      return next()
    }
    console.error(err)
    return res.status(503).send(errors.server_error)
  }
  req.decoded = decoded
  next()
}

exports.login = async (req, res) => {
  let user = null
  if (!req.body || !req.body.name || !req.body.password) {
    return res.status(400).send(errors.missing_parameters)
  }
  try {
    user = await data.User.findOne({ where: { name: req.body.name } })
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
  let token = jwt.sign({ id: user.id }, req.app.get('superSecret'), {
    expiresIn: 86400
  })
  return res.json({
    success: true,
    message: 'logged in !',
    token: token,
    profile: {
      id: user.id,
      name: user.name,
      picture: user.picture,
      rank: user.rank
    }
  })
}

exports.newAccount = async (req, res) => {
  try {
    await Joi.validate(
      { name: req.body.name, password: req.body.password },
      signupSchema
    )
  } catch (err) {
    res.status(400).send(errors.validation)
  }
  try {
    let hash = await bcrypt.hash(req.body.password, 10)
    await data.User.create({
      name: req.body.name,
      password: hash,
      rank: 'User'
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
