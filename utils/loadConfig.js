const config = require('../config.json')

module.exports = {
  DB_TYPE: config.DB_TYPE || 'sqlite',
  DB_SQLITE_PATH: config.DB_SQLITE_PATH || './database.sqlite',
  DB: config.DB || '',
  DB_USERNAME: config.DB_USERNAME || '',
  DB_PASSWORD: config.DB_PASSWORD || '',
  DB_HOST: config.DB_HOST || '',
  DB_PORT: config.DB_PORT || '',
  SECRET: config.SECRET || 'shitty secret',
  ranks: config.ranks || ['Anonymous', 'User', 'Moderator', 'Admin'],
  defaultRank: config.defaultRank || 'User',
  permissions: config.permissions || {
    Admin: { '*': true },
    Moderator: { create_topics: true }
  }
}
