const data = require('../data/_model')
const bcrypt = require('bcrypt')
const config = require('../utils/loadConfig')

module.exports = async () => {
  try {
    let users = await data.User.findAll()
    if (users.length === 0) {
      let hash = await bcrypt.hash('admin', 10)
      await data.User.create({
        name: 'admin',
        password: hash,
        rank: config.ranks[config.ranks.length - 1]
      })
    }
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}
