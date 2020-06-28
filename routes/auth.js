var Auth = require('express').Router()
var bcrypt = require('bcryptjs')
var jwt = require('../middlewares/jwt')

Auth.post('/signup', (req, res, next)=> {

    bcrypt.genSalt(5)
    .then(salt=>{
        return bcrypt.hash(req.body.password, salt)
    })
    .then(hash=>{
        console.log(hash)
        return req.db.collection('user').insertOne({
            ...req.body,
            password: hash
        })
    })
    .then(result=>{
        res.status(200).json({
            success: true,
            message: "User Created Successfully",
            result: result.ops[0]
        })
    })
    .catch(err=>{
        res.status(500).json({
            success: false,
            message: "Internal server error !!!",
            result: err
        })
    })
})

Auth.post('/login', (req, res, next)=>{
    req.db.collection('user').findOne({email: req.body.username})
    .then(user => {
        if(!user){
            res.status(404).json({
                success: false,
                message: "User doesn't exist",
                result: user
            })
        }
        let userData = {
            _id: user._id,
            email: user.email,
            username: user.username 
        }
        return Promise.all([bcrypt.compare(req.body.password, user.password), userData])
    })
    .then(match=>{
        if(match[0]){
            res.status(200).json({
                success: true,
                message: "Logged in successfully",
                result: {
                    email: match[1].email,
                    username: match[1].username,
                    token: jwt.sign(match[1])
                }
            })
        }else{
            res.status(403).json({
                success: false,
                message: "Invalid password",
                result: null
            })
        }
    })
    .catch(err=>{
        res.status(500).json({
            success: false,
            message: "Internal server error !!!",
            result: err
        })
    })
})

Auth.get('/verify', jwt.validate, (req, res, next)=>{
    if(req.jwtpayload){
        res.status(200).json({
            success: true,
            message: "Token verified successfully",
            result: req.jwtpayload
        })
    }
})

module.exports = Auth