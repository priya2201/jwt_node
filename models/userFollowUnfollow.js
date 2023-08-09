const mongoose=require('mongoose')
const followerSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    followers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Follower'
    }]
})

module.exports=mongoose.model('UserFU',followerSchema)