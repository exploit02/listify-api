var listify = require("express").Router();
const { check, validationResult } = require("express-validator");
var ObjectId = require("mongodb").ObjectID;

listify.get(["/", "/:id"], (req, res, next) => {
    let query = req.params.id ? { _id: ObjectId(req.params.id) } : {};
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
                message: "Internal server error !",
            });
        });
});

listify.post(
    "/",
    [
        check("name", "name can't be empty").not().isEmpty(),
        check("completed", "completed can't be empty").not().isEmpty(),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        req.db
            .collection("lists")
            .insertOne(req.body)
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
                    message: "Internal server error !",
                });
            });
    }
);

listify.patch("/name/:id", (req, res, next) => {
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
                success: false,
                message: "Internal server error",
                result: [],
            });
        });
});

module.exports = listify;
