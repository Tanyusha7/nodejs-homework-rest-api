const { Contact } = require("../models/contact");
const { HttpError, ctrlWrapper } = require("../helpers");

const listContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20, favorite = true } = req.query;
  const skip = (page - 1) * limit;

  const data = await Contact.find(
    {
      owner,
      favorite,
    },
    "-createdAt -updatedAt"
  )
    .skip(skip)
    .sort({ name: 1 })
    .limit(limit)
    .populate("owner", "name email");

  // data.forEach((name) => {
  //   name.favorite = favorite;
  //   return name;
  // });

  res.json(data);
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;
  // const data = await Contact.findOne({ _id: contactId });
  const data = await Contact.findById(contactId);
  if (!data) {
    throw new HttpError(404, "Contact not found");
  }
  res.json(data);
};

const addContact = async (req, res) => {
  const { name, phone } = req.body;
  const isUser = await Contact.findOne({ phone }, { name });

  if (isUser) {
    throw new HttpError(409, ` ${name} is exist already`);
  }
  const { _id: owner } = req.user;
  const data = await Contact.create({ ...req.body, owner });

  res.status(201).json(data);
};

const removeContact = async (req, res) => {
  const { contactId } = req.params;
  const data = await Contact.findByIdAndDelete(contactId);
  if (!data) {
    throw new HttpError(404, "Contact not found");
  }
  res.json({ message: "contact deleted" });
};

const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const data = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });

  if (!data) {
    throw new HttpError(404, "Contact not found");
  }
  res.json(data);
};

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
  const data = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });

  if (!data) {
    throw new HttpError(404, "Contact not found");
  }
  res.json(data);
};

module.exports = {
  listContacts: ctrlWrapper(listContacts),
  getContactById: ctrlWrapper(getContactById),
  addContact: ctrlWrapper(addContact),
  removeContact: ctrlWrapper(removeContact),
  updateContact: ctrlWrapper(updateContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
