const router = require("express").Router();
const Vaccination = require("../models/Vaccination.model");

// Create
router.post("/", (req, res) => {
  Vaccination.create(req.body)
    .then((vaccination) => res.json(vaccination))
    .catch((err) => res.status(500).json({ message: "Failed to create vaccination" }));
});

// Read all by pet
router.get("/pet/:petId", (req, res) => {
  Vaccination.find({ pet: req.params.petId })
    .then((vaccinations) => res.json(vaccinations))
    .catch((err) => res.status(500).json({ message: "Failed to fetch vaccinations" }));
});

// Update
router.put("/:id", (req, res) => {
  Vaccination.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((vaccination) => res.json(vaccination))
    .catch((err) => res.status(500).json({ message: "Failed to update vaccination" }));
});

// Delete
router.delete("/:id", (req, res) => {
  Vaccination.findByIdAndDelete(req.params.id)
    .then(() => res.json({ message: "Vaccination deleted" }))
    .catch((err) => res.status(500).json({ message: "Failed to delete vaccination" }));
});

module.exports = router;
