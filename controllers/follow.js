const Follower = require("../models/follow");
const createFollower = async (req, res) => {
  try {
    const { follower, following } = req.body;
    const newFollower = new Follower(req.body);
    await newFollower.save();
    return res
      .status(200)
      .json({ message: "You are now following the user with id "+ follower });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const followUser=async(req,res)=>{
    try {
        const {userID}=req.body;
        const loggedinUserId=req.jwt.userID
        if(userID == loggedinUserId){
            return res.status(400)
            .json({message:'You cannot follow yourself dear'})
        }
    const followerExists=await Follower.findOne({follower:loggedinUserId,
    following:userID})
if(followerExists){
    return res.status(409).json({message:'You are already following this user'})
}

const newFollower=new Follower({
    follower:loggedinUserId,
    following:userID
});
await newFollower.save()

return res.status(201).json({ message: 'You are now following this user.', follower: newFollower });

    } catch (error) {
        console.error('Error following user:', error);
        return res.status(500).json({ message: 'Internal server error.' ,error:error.message});
      }
    
    }
    const getAllFollowers = async (req, res) => {
        try {
          const followers = await Follower.find({});
          if (followers) {
            return res.status(200).json({ message: "followers list", followers });
          }
        } catch (error) {
          return res.status(500).json({ mesage: error.message });
        }
      };

      const unFollowUser=async(req,res)=>{
        try {
          const {userID}=req.body;
          const loggedinUserId=req.jwt.userID;
          if (userID === loggedinUserId) {
            return res.status(400).json({ message: 'You cannot unfollow yourself.' });
          }
      
          // Find and delete the follower relationship
          const followerToDelete = await Follower.findOneAndDelete({ follower: loggedinUserId, following: userID });
      
          if (!followerToDelete) {
            return res.status(404).json({ message: 'You are not following this user.' });
          }
      
          return res.status(200).json({ message: 'You have unfollowed this user.' });
      
        } catch (error) {
          console.error('Error unfollowing user:', error);
          return res.status(500).json({ message: 'Internal server error.' });
        
      
        }
      }
module.exports = { createFollower,followUser ,getAllFollowers,unFollowUser};
