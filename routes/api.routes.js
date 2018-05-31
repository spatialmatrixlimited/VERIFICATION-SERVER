
var validate  = require('../controller/validation.controller')

module.exports = (fastify, options, next) => {

  fastify.get('/validate/:type/:email', validate.validateUser)

  fastify.get('/validated', validate.getValidateUser)
  
  next()

}