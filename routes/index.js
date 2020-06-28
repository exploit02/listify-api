var Router = require("express").Router();
var jwt = require('../middlewares/jwt')

Router.use("/v1", require("./v1/index"));
Router.use("/v2", jwt.validate, require("./v2/index"))
Router.use("/user", require('./auth'))

module.exports = Router;
