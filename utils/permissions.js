const config = require('../utils/loadConfig')

exports.checkPerm = (node, rank) => {
  rank = config.ranks.indexOf(rank)
  let curRank = 0
  if (rank === config.ranks.length - 1) {
    return true
  }
  while (curRank <= rank) {
    if (curRank >= config.ranks.length) {
      return false
    }
    if (config.permissions[config.ranks[curRank]]) {
      if (
        config.permissions[config.ranks[curRank]]['*'] === true ||
        config.permissions[config.ranks[curRank]][node] === true
      ) {
        return true
      }
    }
    curRank += 1
  }
  return false
}

exports.getLowerRanks = rank => {
  return config.ranks.splice(0, config.ranks.indexOf(rank))
}

exports.sub = (rank1, rank2) => {
  return config.ranks.indexOf(rank1) - config.ranks.indexOf(rank2)
}
