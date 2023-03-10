const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
   name:{
    type:String,
    required:true
   },
   email:{
    type:String,
    required:true
   },
   password:{
    type:String,
    required:true
   },
   pic:{
    type:String,
    default:"https://images.unsplash.com/photo-1678121039070-fedd1e9c2cf4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1412&q=80"
   },
   followers:[{
    type:ObjectId,
    ref:'users'
   }],
   following:[{
    type:ObjectId,
    ref:'users'
   }]
})

module.exports = mongoose.model('users',userSchema)