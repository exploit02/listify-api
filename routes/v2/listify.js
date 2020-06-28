var listify = require('express').Router()
const { check, validationResult } = require("express-validator");
var ObjectId = require("mongodb").ObjectID;

listify.post("/",
[
    check("name", "name can't be empty").not().isEmpty(),
    check("completed", "completed can't be empty").not().isEmpty(),
],
(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    let {_id} = req.jwtpayload.data
    req.db
        .collection("lists")
        .insertOne({
            ...req.body,
            userid: ObjectId(_id)
        })
        .then((result) => {
            res.status(200).json({
                success: true,
                message: "Listitem added successfully",
                result: result.ops,
            });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({
                success: false,
                message: "Internal Server Error !",
            });
        });
})

listify.get(["/", "/:id"], (req, res, next) => {

    let { _id } = req.jwtpayload.data
    let query = {"userid": {"$in": [ObjectId(_id)]}}
    if(req.params.id){
        query._id = ObjectId(req.params.id) 
    }
    req.db
        .collection("lists")
        .find(query)
        .toArray()
        .then((rslt) => {
            res.status(200).json({
                success: true,
                message: "All listitems fetched successfully",
                result: rslt,
            });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({
                success: false,
                message: "Internal Server Error !",
            });
        });
});

listify.patch(
    "/name/:id",
    [check("name", "name can't be empty").not().isEmpty()],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        let listid = req.params.id;
        req.db
            .collection("lists")
            .findOneAndUpdate(
                { _id: ObjectId(listid) },
                { $set: { name: req.body.name } },
                { returnNewDocument: true }
            )
            .then((result) => {
                res.status(200).json({
                    success: true,
                    message: "Listitem updated successfully",
                    result: result.value,
                });
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({
                    success: true,
                    message: "Internal Server Error !",
                    result: result.value,
                });
            });
    }
);

listify.patch(
    "/statuschange/:id",
    [
        check(
            "completed",
            "completed field can't be empty for status change call"
        )
            .not()
            .isEmpty(),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        let id = req.params.id;
        req.db
            .collection("lists")
            .findOneAndUpdate(
                { _id: ObjectId(id) },
                { $set: { completed: req.body.completed } }
            )
            .then((result) => {
                res.status(200).json({
                    success: true,
                    message: "Listitem updated successfully",
                    result: result.value,
                });
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({
                    success: true,
                    message: "Internal Server Error !",
                    result: result.value,
                });
            });
    }
);

listify.delete("/:id", (req, res, next) => {
    let id = req.params.id;
    req.db
        .collection("lists")
        .deleteOne({ _id: ObjectId(id) })
        .then((result) => {
            res.status(200).json({
                success: true,
                message: "Listitem deleted successfully",
                result: { deletedCount: result.deletedCount },
            });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({
                success: false,
                message: "Internal Server Error !",
                result: [],
            });
        });
});

module.exports = listify;