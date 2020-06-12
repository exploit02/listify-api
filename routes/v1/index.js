var v1Router = require("express").Router();

v1Router.use("/list", require("./listify"));

module.exports = v1Router;
