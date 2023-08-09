const jwt = require("jsonwebtoken");
const PAID = 1; // 2^0
const ADMIN = 2; // 2^1
const MODERATOR = 4; // 2^2
const validJwt = async (req, res, next) => {
  console.log("inside try");
  const authorizationHeader = req.headers["authorization"];
  if (!authorizationHeader) {
    return res
      .status(404)
      .send({ message: "Authorization haeders are missing" });
  }
  let authorization = authorizationHeader.split(" ");
  if (authorization[0] !== "Bearer") {
    return res
      .status(404)
      .send({ message: "Bearer not provided in auth headers" });
  }
  let token = authorization[1];
  try {
    const decodedToken = jwt.verify(token, "secret key");
    req.jwt = decodedToken;
    console.log("validdd");
    return next();
    // res.status(200)
    // .send({success:true,message:'You are having valid jwt token'})
  } catch (err) {
    // If the token verification fails, return a Forbidden status (403)
    return res.status(403).send({
      mesage: "Forbidden: Invalid or expired token",
      error: err.message,
    });
  }
};

// exports.minimumPermissionLevelAcquired = (required_permission_level) =>
// {
//     return (req,res,next)=>{

//   let user_permission_level = parseInt(req.jwt.permission_level);
//   let user_id = req.jwt.user_id;
//   if (user_permission_level & required_permission_level) {
//     return next();
//   } else {
//     return res.status(403).send();
//   }
// }
// };
const minimumPermissionLevelAcquired = (required_permission_level) => {
    return (req, res, next) => {
      let user_permission_level = parseInt(req.jwt.permissionLevel);
      let user_id = req.jwt.user;

      if ((user_permission_level & required_permission_level) || ( required_permission_level == MODERATOR) ) {
        return next();
        
      }else {
        return res.status(403).send();
      }
    };
  };
  const validJwtUserFU = async (req, res, next) => {
    console.log("inside try");
    const authorizationHeader = req.headers["authorization"];
    if (!authorizationHeader) {
      return res
        .status(404)
        .send({ message: "Authorization haeders are missing" });
    }
    let authorization = authorizationHeader.split(" ");
    if (authorization[0] !== "Bearer") {
      return res
        .status(404)
        .send({ message: "Bearer not provided in auth headers" });
    }
    let token = authorization[1];
    try {
      const decodedToken = jwt.verify(token, "secret key");
      req.jwt = decodedToken;
      console.log("validdd");
      return next();
      // res.status(200)
      // .send({success:true,message:'You are having valid jwt token'})
    } catch (err) {
      // If the token verification fails, return a Forbidden status (403)
      return res.status(403).send({
        mesage: "Forbidden: Invalid or expired token",
        error: err.message,
      });
    }
  };
module.exports = {
     validJwt,
    minimumPermissionLevelAcquired 
    };
