const config = require('../config.json')
const Sequelize = require('sequelize')
const db = {
  type: process.env.DB_TYPE || config.DB_TYPE,
  sqlitePath: process.env.DB_SQLITE_PATH || config.DB_SQLITE_PATH,
  database: process.env.DB || config.DB,
  username: process.env.DB_USERNAME || config.DB_USERNAME,
  password: process.env.DB_PASSWORD || config.DB_PASSWORD,
  host: process.env.DB_HOST || config.DB_HOST,
  port: process.env.DB_PORT || config.DB_PORT
}

exports.sequelize = new Sequelize(db.database, db.username, db.password, {
  host: db.host,
  port: db.port,
  dialect: db.type,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },

  // SQLite only
  storage: db.sqlitePath,

  // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
  operatorsAliases: false
})
