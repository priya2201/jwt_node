const express=require('express')
const route=express.Router()
const {checkingValidation}=require('../validation/verification')
const{createUser, getAllUsers,login}=require('../controllers/userFollowUnfollow')
route.post('/',checkingValidation,createUser)
route.get('/',checkingValidation,getAllUsers)
route.get('/token',login)
module.exports=route