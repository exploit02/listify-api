var statusWise = require("express").Router();
var ObjectId = require("mongodb").ObjectID;

statusWise.get("/", (req, res, next) => [
    req.db
        .collection("lists")
        .aggregate([
            { $group: { _id: "$completed", lists: { $push: "$$ROOT" } } },
        ])
        .toArray()
        .then((result) => {
            res.status(200).json({
                success: true,
                message: "Status wise list fetched successfully",
                result: result,
            });
        })
        .catch((err) => {
            res.status(500).json({
                success: false,
                message: "Internal Server Error !",
            });
        }),
]);

module.exports = statusWise;
