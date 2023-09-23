const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../helpers");
const { PHONE_REGEXP, EMAIL_REGEXP } = require("../constants/regularExp");
const {
  NAME_MIN_LENGTH,
  EMAIL_MIN_LENGTH,
} = require("../constants/fieldLength");

const contactSchema = new Schema(
  {
    name: {
      type: String,
      minlength: NAME_MIN_LENGTH,
      required: true,
    },
    email: {
      type: String,
      minlength: EMAIL_MIN_LENGTH,
      match: EMAIL_REGEXP,
      lowercase: true,
      unique: true,
      required: true,
    },
    phone: {
      type: String,
      match: PHONE_REGEXP,
      required: true,
    },
    favorite: { type: Boolean, default: false },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

const schema = Joi.object({
  name: Joi.string().min(NAME_MIN_LENGTH).required(),
  email: Joi.string()
    .min(EMAIL_MIN_LENGTH)
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .pattern(EMAIL_REGEXP, { name: "email" })
    .lowercase()
    .required(),
  phone: Joi.string()
    .pattern(PHONE_REGEXP, { name: "phone number" })
    .required(),
  favorite: Joi.boolean(),
});

const updateFavorSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const contactSchemasJoi = { schema, updateFavorSchema };
contactSchema.post("save", handleMongooseError);

const Contact = model("contact", contactSchema);

module.exports = { Contact, contactSchemasJoi };
