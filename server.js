'use strict'

const fastify = require('fastify')()
const mongoose = require('mongoose')
const config = require('./config/database')
const w3wEngine = require('./controller/w3w.engine.controller')

mongoose.Promise = global.Promise;
mongoose.connect(config.database, {
    useMongoClient: true,
    config: {
        autoIndex: false
    },
    promiseLibrary: global.Promise
})

fastify.use(require('cors')())
fastify.use(require('dns-prefetch-control')())
fastify.use(require('frameguard')())
fastify.use(require('hide-powered-by')())
fastify.use(require('x-xss-protection')())

fastify.register(require('./routes/api.routes'))

mongoose.connection.on('open', function () {
    console.log('GIS Database is connected')
    console.log('Running W3W Service')
    w3wEngine.processStreet()
    w3wEngine.processProperty()
})

// If the connection throws an error
mongoose.connection.on('error', (err) => {
    console.log('Mongoose default connection error: ' + err)
    clearInterval(w3wInterval)
})

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose default connection disconnected')
    clearInterval(w3wInterval)
})


fastify.listen(7777, err => {
    if (err) throw err
    console.log(`validation server listening on ${fastify.server.address().port}`)
})

let w3wInterval = setInterval(()=>{
    console.log('Running W3W Service')
    w3wEngine.processStreet()
    w3wEngine.processProperty()
    // w3wEngine.processEntity()
},(60 * (60 * 1000)));

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function () {
    mongoose.connection.close(() => {
        console.log('Mongoose default connection disconnected through app termination')
        process.exit(0)
    })
})