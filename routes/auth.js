const express = require("express")
const users = require("../models/user")
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { SECRETKEY } = require("../keys")
const requireLogin = require("../middleware/requireLogin")


router.post("/signup",(req,res)=>{
    const {name,email,password,pic}= req.body

    if(!email || !name || !password){
       
        res.status(422).json({error:"Please Add all the fields"})
    }else{
        users.findOne({email:email})
            .then((savedUser)=>{
                if(savedUser){
                res.status(422).json({error:"User Already exits"})
                }else{
                    bcrypt.hash(password,12)
                    .then(hashedPassword=>{
                       const user1 = new users({
                        name,email,password:hashedPassword,pic
                        
                       })
                       user1.save()
                       .then(user => {
                        res.status(200).json({msg:"User added successfully"})
                       })
                    })
                }
            })
            
            
    }
})


router.post("/login",(req,res)=>{
    const {email,password} =req.body
    if(!email || !password){
        return res.status(422).json({error:"Please add email and password"})
    }else{
        users.findOne({email:email})
         .then(dbUser =>{
            if(!dbUser){
                return res.status(422).json({error:"Invalid EmailId!!!"})
            }else{
                bcrypt.compare(password,dbUser.password)
                .then(doMatch =>{
                    if(doMatch){
                     const token =jwt.sign({id:dbUser._id},SECRETKEY)
                     return res.json({token})
                    }else{
                        return res.status(422).json({error:"Invalid Password!!!"})
                    }
                })
            }
         })
    }
})

router.get("/protected",requireLogin,(req,res)=>{
    res.json(req.user)
})


module.exports = router