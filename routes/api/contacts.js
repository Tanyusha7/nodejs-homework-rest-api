const express = require("express");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
} = require("../../controllers/contacts");

const { validateBody, isValidId, authenticate } = require("../../middlewares");
const { contactSchemasJoi } = require("../../models/contact");

const router = express.Router();

router.get("/", authenticate, listContacts);

router.get("/:contactId", authenticate, isValidId, getContactById);

router.post(
  "/",
  authenticate,
  validateBody(contactSchemasJoi.schema),
  addContact
);

router.delete("/:contactId", authenticate, isValidId, removeContact);

router.put(
  "/:contactId",
  authenticate,
  isValidId,
  validateBody(contactSchemasJoi.schema),
  updateContact
);

router.patch(
  "/:contactId/favorite",
  authenticate,
  isValidId,
  validateBody(contactSchemasJoi.updateFavorSchema),
  updateStatusContact
);
module.exports = router;
