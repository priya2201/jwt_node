const UserFU = require("../models/userFollowUnfollow");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const login = async (req, res) => {
  try {
    const { userID } = req.body;
    // let {permissionLevel}=req.body;
    // const refreshId=userID+ permissionLevel + 'secret key'
    // const salt=crypto.randomBytes(16).toString('base64')
    // const hash=crypto.createHmac('sha512',salt).update(refreshId).digest('base64')
    // const refresh_token=Buffer.from(hash).toString('base64')

    const accessToken = jwt.sign({ userID }, "secret key", { expiresIn: "1h" });

    return res.status(201).json({ accessToken});
  } catch (err) {
    res.status(500).json({ errors: err.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await UserFU.findOne({ username });
    if (existingUser) {
      return res.status(404).json({ message: "USer is already existing " });
    }
    let salt = crypto.randomBytes(16).toString("base64");
    let hash = crypto
      .createHmac("sha512", salt)
      .update(req.body.password)
      .digest("base64");
    req.body.password = salt + "@" + hash;
    const user = new UserFU(req.body);
    console.log(user);
    await user.save();
    return res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    return res.status(500).json({ mesage: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await UserFU.find({});
    if (users) {
      return res.status(200).json({ message: "Users list", users });
    }
  } catch (error) {
    return res.status(500).json({ mesage: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserFU.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User detail info", user });
  } catch (error) {
    return res.status(500).json({ mesage: error.message });
  }
};

const updateUserById=async(req,res)=>{
    const {userId}=req.params.id;
    const {username,passsword}=req.body;

}

 
module.exports = { login, createUser,getAllUsers,getUserById };
