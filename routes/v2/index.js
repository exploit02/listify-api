var indexRoutes = require('express').Router()

indexRoutes.use('/list', require('./listify'))
indexRoutes.use('/statusWise', require('./statusWise'))

module.exports = indexRoutes;