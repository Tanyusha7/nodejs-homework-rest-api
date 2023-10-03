const express = require("express");

const {
  signup,
  verifyEmail,
  resendVerifyMail,
  signin,
  signout,
  getCurrentUser,
  updateSubscription,
  updateUserAvatar,
  removeUser,
} = require("../../controllers/auth");
const { validateBody, authenticate, upload } = require("../../middlewares");
const { userSchemaJoi } = require("../../models/user");

const router = express.Router();

//SIGNUP//
router.post("/register", validateBody(userSchemaJoi.schema), signup);

router.get("/verify/:verificationToken", verifyEmail);

router.post(
  "/verify",
  validateBody(userSchemaJoi.schemaVarifyMail),
  resendVerifyMail
);

//SIGNIN//

router.post("/login", validateBody(userSchemaJoi.schema), signin);

router.get("/current", authenticate, getCurrentUser);

router.post("/logout", authenticate, signout);

router.patch(
  "/",
  authenticate,
  validateBody(userSchemaJoi.schemaSubcription),
  updateSubscription
);

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  updateUserAvatar
);

router.delete("/:id", authenticate, removeUser);

module.exports = router;
