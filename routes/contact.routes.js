const router = require("express").Router();
const Contact = require("../models/Contact.model");

// Get all contacts for a pet
router.get("/:petId", async (req, res) => {
  try {
    const contacts = await Contact.find({ pet: req.params.petId });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: "Failed to get contacts" });
  }
});

// Create new contact
router.post("/", async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json(contact);
  } catch (err) {
    res.status(400).json({ message: "Failed to create contact" });
  }
});

// Update contact
router.put("/:contactId", async (req, res) => {
  try {
    const updated = await Contact.findByIdAndUpdate(req.params.contactId, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Failed to update contact" });
  }
});

// Delete contact
router.delete("/:contactId", async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.contactId);
    res.json({ message: "Contact deleted" });
  } catch (err) {
    res.status(400).json({ message: "Failed to delete contact" });
  }
});

module.exports = router;
