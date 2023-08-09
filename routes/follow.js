const express=require('express')
const route=express.Router()
const {createFollower, followUser,getAllFollowers, unFollowUser}=require('../controllers/follow')
const {validJwt}=require('../validation/authorization')
const {checkingValidation}=require('../validation/verification')

route.post('/',checkingValidation,createFollower)
route.put('/',validJwt,followUser)
route.get('/',getAllFollowers)
route.put('/data',validJwt,unFollowUser)
module.exports=route