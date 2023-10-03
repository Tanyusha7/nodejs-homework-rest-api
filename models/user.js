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
    avatarURL: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      default: "",
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

const schema = Joi.object({
  name: Joi.string().min(NAME_MIN_LENGTH),
  email: Joi.string()
    .min(EMAIL_MIN_LENGTH)
    .pattern(EMAIL_REGEXP, { name: "email" })
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "ua"] } })
    .lowercase()
    .required(),
  password: Joi.string()
    .pattern(PASSWORD_REGEXP, { name: "password" })
    .required(),
  subscription: Joi.string().valid("starter", "pro", "business"),
});

const schemaSubcription = Joi.object().keys({
  // name: schema.extract("name").optional(),
  subscription: schema.extract("subscription").required().optional(),
});

const schemaVarifyMail = Joi.object().keys({
  email: schema.extract("email").optional(),
});

const userSchemaJoi = {
  schema,
  schemaSubcription,
  schemaVarifyMail,
};

userSchema.post("save", handleMongooseError);
const User = model("user", userSchema);

module.exports = {
  User,
  userSchemaJoi,
};
