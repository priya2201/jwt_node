const express=require('express');
const connectDB = require('./connection/mongoose');
const userRoute=require('./routes/user');
const userFollowUnfollow=require('./routes/userFollowUnfollow')
const follow=require('./routes/follow')
const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:false}));
app.use('/api/user',userRoute)
app.use('/api/v1/userData',userFollowUnfollow)
app.use('/api/v1/follower',follow)
const port =5000;
async function start(){
   await connectDB.then(()=>{
        console.log('connection  succesfully')
    }).catch((err)=>{
        console.error('Mongooose connection error',err)
    })
    app.listen(port,()=>{
    console.log(`server is listening on port ${port}`)
})
}
start()