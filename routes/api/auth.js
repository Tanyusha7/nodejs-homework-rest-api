const express = require("express");

const {
  signup,
  signin,
  signout,
  getCurrentUser,
} = require("../../controllers/auth");
const { validateBody, authenticate } = require("../../middlewares");
const { userSchemaJoi } = require("../../models/user");

const router = express.Router();

router.post("/register", validateBody(userSchemaJoi.schema), signup);

router.post("/login", validateBody(userSchemaJoi.schema), signin);

router.get("/current", authenticate, getCurrentUser);

router.post("/logout", authenticate, signout);

module.exports = router;
