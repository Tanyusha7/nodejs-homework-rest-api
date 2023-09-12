const express = require("express");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
} = require("../../controllers/contacts");

const { validateBody, isValidId } = require("../../middlewares");
const { schemasJoi } = require("../../models/contact");

const router = express.Router();

router.get("/", listContacts);

router.get("/:contactId", isValidId, getContactById);

router.post("/", validateBody(schemasJoi.schema), addContact);

router.delete("/:contactId", isValidId, removeContact);

router.put(
  "/:contactId",
  isValidId,
  validateBody(schemasJoi.schema),
  updateContact
);

router.patch(
  "/:contactId/favorite",
  isValidId,
  validateBody(schemasJoi.updateFavorSchema),
  updateStatusContact
);
module.exports = router;
