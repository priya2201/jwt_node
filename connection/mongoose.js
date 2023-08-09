const mongoose=require('mongoose');
const connectDB=mongoose.connect('mongodb+srv://piyu:piyu1122@cluster0.jsnhqqv.mongodb.net/token_jwt')
module.exports=connectDB;
