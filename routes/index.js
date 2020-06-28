var Router = require("express").Router();

Router.use("/v1", require("./v1/index"));
Router.use("/user", require('./auth'))

module.exports = Router;
