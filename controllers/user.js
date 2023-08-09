const User = require("../models/user");
const crypto = require("crypto");
const jwt=require('jsonwebtoken')


const createUser = async (req, res) => {
  let salt = crypto.randomBytes(16).toString("base64");
  let hash = crypto
    .createHmac("sha512", salt)
    .update(req.body.password)
    .digest("base64");
  req.body.password = salt + "$" + hash;
  req.body.permissionLevel = 1;
  const userData = new User(req.body);
  console.log(userData);
  await userData.save();
  return res.status(200).json({ message: "User Created", userData });
};

const userById = async (req, res) => {
  const userId = req.params.id;
  try {
    const userData = await User.findById(userId);
    if (userData) {
      console.log(userData);
      return res.status(200).json({ message: "Users Info", userData });
    } else {
      return res.status(400).json({ error: "User not found" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Server error" });
  }
};
const updateUser = async (req, res) => {
  console.log("inside tryyy");
  if (req.body.password) {
    let salt = crypto.randomBytes(16).toString("base64");
    let hash = crypto
      .createHmac("sha512", salt)
      .update(req.body.password)
      .digest("base64");
    req.body.password = salt + "$" + hash;
  }
  const userId = req.params.id;
  const userData = await User.findByIdAndUpdate(userId, req.body.password);
  if (userData) {
    console.log(userData);
    return res.status(200).json({ message: "User Updated", userData });
  } else {
    return res.status(400).json({ error: "User not found" });
  }
};
const listOfUser = async (req, res) => {
  let limit =
    req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
  let page = 0;
  if (req.query) {
    if (req.query.page) {
      req.query.page = parseInt(req.query.page);
      page = Number.isInteger(req.query.page) ? req.query.page : 0;
    }
  }
  const userData = await User.find({})
    .limit(limit)
    .skip(limit * page);
  if (userData) {
    return res.status(200).json({ message: "Users List", userData });
  } else {
    return res.status(400).json({ error: "User not found" });
  }
};
const deleteUser = async (req, res) => {
  const userId = req.params.id;
  const userData = await User.findByIdAndDelete(userId);
  console.log(userData);
  if (userData) {
    return res
      .status(200)
      .json({ success: true, message: "The user has been deleted", userData });
  } else {
    return res.status(400).json({ message: "User not found" });
  }
};

const isPasswordAnduserMatch = async (req, res, next) => {
  const { email, password } = req.body;
  const UserHavingEmail = await User.findOne({ email: email });
  console.log(UserHavingEmail);
  console.log("password");
  if (!UserHavingEmail) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  let passwordFields = UserHavingEmail.password.split("$");
  let salt = passwordFields[0];
  let hash = crypto
    .createHmac("sha512", salt)
    .update(password)
    .digest("base64");
  if (hash === passwordFields[1]) {
    req.body = {
      userID: UserHavingEmail._id,
      email: UserHavingEmail.email,
      permissionLevel: UserHavingEmail.permissionLevel,
      provider: "email",
      name: UserHavingEmail.firstName + " " + UserHavingEmail.lastName,
    };
    return res
      .status(200)
      .json({ success: true, message: "User is authenticated" });
  } else {
    return res.status(400).send({ errors: ["Invalid email or password"] });
  }
};
// const isPasswordAndUserMatch = (req, res, next) => {
//     User.findByEmail(req.body.email)
//         .then((user)=>{
//             if(!user[0]){
//                 res.status(404).send({});
//             }else{
//                 let passwordFields = user[0].password.split('$');
//                 let salt = passwordFields[0];
//                 let hash = crypto.createHmac('sha512', salt)
//                                  .update(req.body.password)
//                                  .digest("base64");
//                 if (hash === passwordFields[1]) {
//                     req.body = {
//                         userId: user[0]._id,
//                         email: user[0].email,
//                         permissionLevel: user[0].permissionLevel,
//                         provider: 'email',
//                         name: user[0].firstName + ' ' + user[0].lastName,
//                     };
//                     return next();
//                 } else {
//                     return res.status(400).send({errors: ['Invalid email or password']});
//                 }
//             }
//         });
//  };

const login=async(req,res)=>{
    try{
        const {userID}=req.body;
        let {permissionLevel}=req.body;
        const refreshId=userID+ permissionLevel + 'secret key'
        const salt=crypto.randomBytes(16).toString('base64')
        const hash=crypto.createHmac('sha512',salt).update(refreshId).digest('base64')
        const refresh_token=Buffer.from(hash).toString('base64')

        const accessToken=jwt.sign({userID,permissionLevel},'secret key',{expiresIn :'1h'})

        return res.status(201).json({accessToken,refreshToken:refresh_token})
    }
    catch (err) {
        res.status(500).json({ errors: err.message });
    }
};

// const validJwt=async(req,res)=>{
//     console.log('inside try')
//     const authorizationHeader=req.headers['authorization']
//     if(!authorizationHeader){
//         return res.status(404)
//         .send({message:'Authorization haeders are missing'})
//     }
//     let authorization=authorizationHeader.split(' ')
//     if(authorization[0] !== 'Bearer'){
//         return res.status(404)
//         .send({message:'Bearer not provided in auth headers'})
//     }
//     let token=authorization[1]
// try{
//     const decodedToken=jwt.verify(token,'secret key');
//     req.jwt=decodedToken;

//     return res.status(200)
//     .send({success:true,message:'You are having valid jwt token'})
// }catch (err) {
//     // If the token verification fails, return a Forbidden status (403)
//     return res.status(403).send({ mesage: 'Forbidden: Invalid or expired token' ,error:err.message});
// }
    
// }
module.exports = {
  createUser,
  userById,
  updateUser,
  listOfUser,
  deleteUser,
// isPasswordAndUserMatch,
  isPasswordAnduserMatch,
  login,
  //validJwt
};
