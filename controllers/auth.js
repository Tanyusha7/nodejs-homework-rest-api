const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const Jimp = require("jimp");
const fs = require("fs").promises;
const { nanoid } = require("nanoid");

require("dotenv").config();

const { SECRET_KEY, BASE_URL } = process.env;
const { User } = require("../models/user");
const { ctrlWrapper, HttpError, sendEmail } = require("../helpers");

const avatarDir = path.join(__dirname, "..", "public", "avatars");

//SIGNUP//

const signup = ctrlWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw new HttpError(409, `Email ${email} is exist already`);
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify your email",
    http: `<a href="${BASE_URL}/api/users/verify/${verificationToken}" target="_blank">Verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    name: newUser.name,
    email: newUser.email,
    subscription: newUser.subscription,
  });
});

const verifyEmail = ctrlWrapper(async (req, res) => {
  const { verificationToken } = req.params;

  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  });

  res.json({ message: "Verification successful" });
});

const resendVerifyMail = ctrlWrapper(async (req, res) => {
  const user = await User.findOne(req.body.email);
  if (!user) {
    throw new HttpError(401, "Missing required field email");
  }
  if (user.verify) {
    throw new HttpError(400, "Verification has already been passed");
  }
  const verifyEmail = {
    to: email,
    subject: "Verufy your email",
    http: `<a href="${BASE_URL}/api/users/verify/${user.verificationToken}" target="_blank" Verify email </a>`,
  };

  await sendEmail(verifyEmail);

  res.json({ message: "Verification email sent" });
});

//SIGNIN//
const signin = ctrlWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new HttpError(401, "Email or password is wrong");
  }

  const comparePassword = await bcrypt.compare(password, user.password);

  if (!comparePassword) {
    throw new HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "18h" });

  await User.findByIdAndUpdate(user._id, { token });

  res.json({ token });
});

const getCurrentUser = ctrlWrapper(async (req, res) => {
  const { name, email } = req.user;
  res.json({ name, email });
});

const signout = ctrlWrapper(async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: "" });
  res.json({ message: "Signout successful" });
});

const updateSubscription = ctrlWrapper(async (req, res) => {
  const updateUser = await User.findOneAndUpdate({}, req.body, {
    new: true,
  });

  res.json(updateUser);
});

const updateUserAvatar = ctrlWrapper(async (req, res) => {
  const { _id } = req.user;
  const { path: tmpDir, originalname } = req.file;

  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarDir, filename);

  const img = await Jimp.read(tmpDir);
  await img.resize(250, 250).greyscale().writeAsync(tmpDir);

  await fs.rename(tmpDir, resultUpload);

  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });
  res.json({ avatarURL });
});

const removeUser = ctrlWrapper(async (req, res) => {
  const { _id } = req.user;

  const removeUser = await User.findByIdAndRemove(_id);
  if (!removeUser) {
    throw new HttpError(404, "User not found");
  }
  res.json({ message: "User deleted" });
});

module.exports = {
  signup,
  verifyEmail,
  resendVerifyMail,
  signin,
  getCurrentUser,
  signout,
  updateSubscription,
  updateUserAvatar,
  removeUser,
};

exports.signin = signin;
