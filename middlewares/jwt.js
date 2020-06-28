var jsonwebtoken = require('jsonwebtoken')

const jwt = {
    sign: (payload)=> {
        return jsonwebtoken.sign({
            data: payload
        }, process.env.SECRET, { expiresIn: process.env.EXP})
    },
    validate: (req, res, next)=>{
        let tokenArray = req.headers.authorization.split(" ")

        try{
            let payload = jsonwebtoken.verify(tokenArray[1], process.env.SECRET)
            req.jwtpayload = payload
            next()
        }catch(e){
            res.status(401).json({
                success: false,
                message: "Invalid Token !!!",
                result: e
            })
        }
        
    }
}

module.exports = jwt;