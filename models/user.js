const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../helpers");
const { EMAIL_REGEXP, PASSWORD_REGEXP } = require("../constants/regularExp");
const {
  NAME_MIN_LENGTH,
  EMAIL_MIN_LENGTH,
} = require("../constants/fieldLength");

const userSchema = new Schema(
  {
    name: { type: String, minlength: NAME_MIN_LENGTH },
    email: {
      type: String,
      minlength: EMAIL_MIN_LENGTH,
      match: EMAIL_REGEXP,
      lowercase: true,
      unique: true,
      required: true,
    },
    password: { type: String, match: PASSWORD_REGEXP, required: true },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: "",
    },
  },
  { versionKey: false, timestamps: true }
);

const schema = Joi.object({
  name: Joi.string().min(NAME_MIN_LENGTH),
  email: Joi.string()
    .min(EMAIL_MIN_LENGTH)
    .pattern(EMAIL_REGEXP, { name: "email" })
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .lowercase()
    .required(),
  password: Joi.string()
    .pattern(PASSWORD_REGEXP, { name: "password" })
    .required(),
  repeat_password: Joi.ref("password"),
});

const userSchemaJoi = {
  schema,
};

userSchema.post("save", handleMongooseError);
const User = model("user", userSchema);

module.exports = {
  User,
  userSchemaJoi,
};
