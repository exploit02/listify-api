var statusWise = require('express').Router()
var ObjectId = require("mongodb").ObjectID;

statusWise.get('/', (req, res, next)=>{
    req.db.collection('lists').aggregate([
        {
            $match: {userid: ObjectId(req.jwtpayload.data._id)}
        },
        {
          $group : { _id : "$completed", lists: { $push: "$$ROOT" }, count: {$sum: 1} }
        }
        
      ]).toArray().then(result=>{
          res.status(200).json({
              success: true,
              message: "Listitems fetched successfully",
              result: result
          })
      })
      .catch(err=>{
          res.status(500).json({
              success: true,
              message: "Internal server error !!!",
              result: null
          })
      })
})

module.exports = statusWise;