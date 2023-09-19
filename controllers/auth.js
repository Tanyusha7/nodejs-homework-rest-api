const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { SECRET_KEY } = process.env;
const { User } = require("../models/user");

const { ctrlWrapper, HttpError } = require("../helpers");

// const payload = { id: "650960efdc99b01ff7511004" };
// const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "20h" });
// console.log(token);
// const decodedToken = jwt.decode(token);
// console.log(decodedToken);

// try {
//   const { id } = jwt.verify(
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MDk2MGVmZGM5OWIwMWZmNzUxMTAwNCIsImlhdCI6MTY5NTEzNDI5OCwiZXhwIjoxNjk1MjA2Mjk4fQ.T4iJXVgxcw2vi2nESbJ0W0kHm3-rBBS1vdDSpMZUG",
//     SECRET_KEY
//   );
//   console.log(id);
// } catch (error) {
//   console.log(error.message);
// }

// const creatHashPassword = async (password) => {
//   const result = await bcrypt.hash(password, 10);
//   const pas = await bcrypt.compare(password, result);
// };

const signup = ctrlWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw new HttpError(409, `Email ${email} is exist already`);
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...req.body, password: hashPassword });

  res.status(201).json({
    name: newUser.name,
    email: newUser.email,
    subscription: user.subscription,
  });
});

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

module.exports = {
  signup,
  signin,
  getCurrentUser,
  signout,
};
