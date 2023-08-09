const mongoose=require('mongoose')
const followerSchema=new mongoose.Schema({
    follower:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'UserFU',
    },
    following:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'UserFU',
    }
})

module.exports=mongoose.model('Follower',followerSchema)