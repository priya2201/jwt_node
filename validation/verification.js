const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();
const checkingValidation = async (req, res, next) => {
  const hmac = req.get("Crypto-Verify");
  const requestBody = JSON.stringify(req.body);
  console.log(requestBody, "req");

  const digest = crypto
    .createHmac("sha256", process.env.SECRET)
    .update(requestBody)
    .digest("base64");

  console.log("Hmac" + hmac);
  console.log("digest", digest);

  if (hmac == digest) {
    console.log("Req validated");
    req.validated = true;
    next();
  } else {
    console.log("validation error");
    req.validated = false;
    res.status(400).json({
      success: false,
      message: "Request validation failed... Invalid request",
    });
  }
};

module.exports = { checkingValidation };
