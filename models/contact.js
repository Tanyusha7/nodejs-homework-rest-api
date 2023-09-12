const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

const phoneRegexp = /^\(\d{3}\)\s\d{3}-\d{4}/;

const contactSchema = new Schema(
  {
    name: { type: String, required: [true, "Set name for contact"] },
    email: { type: String },
    phone: {
      type: String,
      match: phoneRegexp,
      required: [true, "Add a phone number"],
    },
    favorite: { type: Boolean, default: false },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.post("save", handleMongooseError);

const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
}).pattern(phoneRegexp, Joi.boolean());

const updateFavorSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const schemasJoi = { schema, updateFavorSchema };

const Contact = model("contact", contactSchema);

module.exports = { Contact, schemasJoi };
