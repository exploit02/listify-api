var listify = require("express").Router();

listify.get("/", (req, res, next) => {
    res.status(200).json({
        message: "from get",
    });
});

listify.post("/", (req, res, next) => {
    res.status(200).json({
        success: true,
    });
});

module.exports = listify;
