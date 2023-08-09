const express = require("express");
const {
  validJwt,
  minimumPermissionLevelAcquired,
} = require("../validation/authorization");
const route = express.Router();
// delete require.cache[require.resolve('../validation/authorization')];

// const PermissionMiddleware = require("../validation/authorization");
const PAID = 1; // 2^0
const ADMIN = 2; // 2^1
const MODERATOR = 4; // 2^2

const {
  createUser,
  userById,
  updateUser,
  listOfUser,
  deleteUser,
  //isPasswordAndUserMatch,
  isPasswordAnduserMatch,
  login,
  //validJwt,
} = require("../controllers/user");
route.post("/", createUser);
route.get("/:id", validJwt, minimumPermissionLevelAcquired(PAID), userById);
route.patch(
  "/:id",
  validJwt,
  minimumPermissionLevelAcquired(ADMIN),
  updateUser
);
route.get(
  "/data/list",
  validJwt,
  minimumPermissionLevelAcquired(MODERATOR),
  listOfUser
);
route.delete(
  "/:id",
  validJwt,
  minimumPermissionLevelAcquired(ADMIN),
  deleteUser
);
route.patch("/", [
  validJwt,
  minimumPermissionLevelAcquired(MODERATOR),
  isPasswordAnduserMatch,
]);
route.post(
  "/token",
//   validJwt,
//   minimumPermissionLevelAcquired(MODERATOR),
  login
);

//route.get('/auth/valid',validJwt)
module.exports = route;
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2NGJmODJhMTVhYzMzNTkzYmMyMTY2OTgiLCJwZXJtaXNzaW9uTGV2ZWwiOjQsImlhdCI6MTY5MDI3Njc3MiwiZXhwIjoxNjkwMjgwMzcyfQ.lO8eQap8Migyqgi5Ielk-ay8jehHa0MgHThTYxR-POU
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2NGJmODJhMTVhYzMzNTkzYmMyMTY2OTgiLCJwZXJtaXNzaW9uTGV2ZWwiOjIsImlhdCI6MTY5MDI3NjgyMSwiZXhwIjoxNjkwMjgwNDIxfQ.gLhcJXxamUJE8wlwko3NMHEr8GkGiyOnTV3O9rYItj8