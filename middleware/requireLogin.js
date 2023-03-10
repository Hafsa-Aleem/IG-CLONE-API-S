const jwt = require('jsonwebtoken')
const { SECRETKEY } = require("../keys")
const users = require("../models/user")


module.exports = (req,res,next) =>{
    console.log(req.headers)
    const {authorization}= req.headers  //Bearer XXXX.YYYY.ZZZZ
    if(!authorization){
        return res.status(401).json({error:"You must be logged in"})
    }else{
        const token = authorization.replace("Bearer ","")
        jwt.verify(token,SECRETKEY,(err,payload)=>{
            if(err){
                return res.status(401).json({error:"You must be logged in"})
            }else{
               const {id} = payload

               users.findById(id)
               .then(userData=>{
                userData.password = undefined
                
                req.user = userData
                next()
               })
            }
        })
    }
}
