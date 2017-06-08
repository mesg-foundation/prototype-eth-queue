var merge = require('webpack-merge')
var prodEnv = require('./prod.env')


module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  PROVIDER_ENDPOINT: "'http://localhost:8545'",
  CONTRACT_ADDRESS: "'0xcc76461E9f5Bb8a623eaAEA495DBfa67dd36680c'"
})
