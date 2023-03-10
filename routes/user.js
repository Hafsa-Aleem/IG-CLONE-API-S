const express = require('express')
const requireLogin = require('../middleware/requireLogin')
const router = express.Router()
const users = require('../models/user')
const Post = require('../models/post')

router.get("/user/:id",requireLogin,(req,res)=>{
    users.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{
        Post.find({postedBy:req.params.id})
        .populate("postedBy","_id name")
        .exec((err,posts)=>{
          if(err){
            return res.status(422).json({error:err})
          }else{
            return res.status(200).json({user,posts})
          }
        })
    })
})





router.put("/follow",requireLogin,(req,res)=>{
    users.findByIdAndUpdate(req.body.followId,{$push:{followers:req.user._id}},
        {
            new:true
        },(err,result)=>{
            if(err)
            return res.status(422).json({error:err})
          else{
            users.findByIdAndUpdate(req.user._id,{
                $push:{following:req.body.followId}
            },{
                new:true
            })
            .select("-password")
            .then(result => res.json(result))
          }
        })
})


module.exports = router