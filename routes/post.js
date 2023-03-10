const express = require('express')
const requireLogin = require('../middleware/requireLogin')
const router = express.Router()
const Post = require('../models/post')

router.post("/createPost",requireLogin,(req,res)=>{
const {title,body,pic} = req.body
if(!title || !body || !pic){
    return res.status(422).json({error:"Please add all the fields"})
}else{

const post = new Post({title,body,photo:pic,postedBy:req.user})
post.save()
     .then(result => res.json(result))

}
})

router.get("/allpost",requireLogin,(req,res)=>{
    Post.find()
    .populate("postedBy","_id name")
    .then(posts=> res.json(posts))
})

router.get("/mypost",requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
        .populate("postedBy","_id name")
        .then(mypost => {
            res.json(mypost)
        })
})

router.put("/like",requireLogin,(req,res)=>{
Post.findByIdAndUpdate(req.body.postId,{
    $push:{likes:req.user._id}
},{
    new:true
})
.then(result => res.json(result))
})

router.put("/unlike",requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    })
    .populate("postedBy","name")
    .then(result => res.json(result))
    })
router.put("/comment",requireLogin,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id email")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})

        }else{
            return res.json(result)
        }
    })

})

router.delete("/deletepost/:postID",requireLogin,(req,res)=>{
    Post.findOne({id:req.params.postId})
    .populate("postedBy","_id name")
    .exec((err,post)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
            post.remove()
            .then(result =>{
                return res.json({result})
            })
        }
    })
})

module.exports = router