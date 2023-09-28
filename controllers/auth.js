const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const Jimp = require("jimp");
const fs = require("fs").promises;

require("dotenv").config();

const { SECRET_KEY } = process.env;
const { User } = require("../models/user");

const { ctrlWrapper, HttpError } = require("../helpers");
const { token } = require("morgan");

const avatarDir = path.join(__dirname, "..", "public", "avatars");

const signup = ctrlWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw new HttpError(409, `Email ${email} is exist already`);
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const avatarURL = gravatar.url(email);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });

  res.status(201).json({
    name: newUser.name,
    email: newUser.email,
    subscription: newUser.subscription,
  });
});

const signin = ctrlWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  console.log(user);
  if (!user) {
    throw new HttpError(401, "Email or password is wrong");
  }

  const comparePassword = await bcrypt.compare(password, user.password);

  if (!comparePassword) {
    throw new HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user.id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "18h" });

  await User.findByIdAndUpdate(user.id, { token });

  res.json({ token });
});

const getCurrentUser = ctrlWrapper(async (req, res) => {
  const { name, email } = req.user;
  res.json({ name, email });
});

const signout = ctrlWrapper(async (req, res) => {
  const { id } = req.user;

  await User.findByIdAndUpdate(id, { token: "" });
  res.json({ message: "Signout successful" });
});

const updateSubscription = ctrlWrapper(async (req, res) => {
  const updateUser = await User.findOneAndUpdate({}, req.body, {
    new: true,
  });

  res.json(updateUser);
});

const updateUserAvatar = ctrlWrapper(async (req, res) => {
  const { id } = req.user;
  const { path: tmpDir, originalname } = req.file;

  const filename = `${id}_${originalname}`;
  const resultUpload = path.join(avatarDir, filename);

  const img = await Jimp.read(tmpDir);
  await img.resize(250, 250).greyscale().writeAsync(tmpDir);

  await fs.rename(tmpDir, resultUpload);

  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(id, { avatarURL });
  res.json({ avatarURL });
});

const removeUser = ctrlWrapper(async (req, res) => {
  const { id } = req.user;

  const removeUser = await User.findByIdAndRemove(id);
  if (!removeUser) {
    throw new HttpError(404, "User not found");
  }
  res.json({ message: "User deleted" });
});

module.exports = {
  signup,
  signin,
  getCurrentUser,
  signout,
  updateSubscription,
  updateUserAvatar,
  removeUser,
};

exports.signin = signin;
