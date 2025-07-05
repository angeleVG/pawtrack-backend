const router = require("express").Router();
const Weight = require("../models/Weight.model");
const Pet = require("../models/Pet.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");



// GET all weights for current user’s pet(s)
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const pet = await Pet.findOne({ owner: req.payload._id });
    if (!pet) return res.status(404).json({ message: "No pet found" });

    const weights = await Weight.find({ pet: pet._id }).sort({ date: 1 });
    res.json(weights);
  } catch (err) {
    res.status(500).json({ message: "Error fetching weights" });
  }
});

// POST new weight
router.post("/", isAuthenticated, async (req, res) => {
  try {
    const pet = await Pet.findOne({ owner: req.payload._id });
    if (!pet) return res.status(404).json({ message: "No pet found" });

    const newWeight = await Weight.create({
      pet: pet._id,
      value: req.body.value,
    });

    res.status(201).json(newWeight);
  } catch (err) {
    res.status(500).json({ message: "Error creating weight entry" });
  }
});

// DELETE a weight by id
router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    await Weight.findByIdAndDelete(req.params.id);
    res.json({ message: "Weight entry deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting weight entry" });
  }
});

module.exports = router;