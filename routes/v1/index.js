var v1Router = require("express").Router();

v1Router.use("/list", require("./listify"));
v1Router.use("/statuswise", require("./statusWiseList"));

module.exports = v1Router;
