const router = require("express").Router();
const Food = require("../models/Food.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// Create food and link to petId
router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const foodData = { ...req.body, owner: req.payload._id };
    const newFood = await Food.create(foodData);
    res.status(201).json(newFood);
  } catch (error) {
    console.error("Error creating food:", error);
    res.status(500).json({ message: "Failed to create food" });
  }
});

// Get all food entries for this user
router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const foods = await Food.find({ owner: req.payload._id });
    res.json(foods);
  } catch (error) {
    console.error("Error fetching food entries:", error);
    res.status(500).json({ message: "Failed to fetch food entries" });
  }
});

// Get food by petId
router.get("/:petId", isAuthenticated, async (req, res, next) => {
  try {
    const food = await Food.findOne({ pet: req.params.petId });
    if (!food) return res.status(404).json({ message: "No food found for this pet" });
    res.json(food);
  } catch (error) {
    console.error("Error fetching food:", error);
    res.status(500).json({ message: "Failed to fetch food" });
  }
});

// Update food by foodId
router.put("/:foodId", isAuthenticated, async (req, res, next) => {
  try {
    const updated = await Food.findByIdAndUpdate(req.params.foodId, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    console.error("Error updating food:", error);
    res.status(500).json({ message: "Failed to update food" });
  }
});

// Delete food by foodId
router.delete("/:foodId", isAuthenticated, async (req, res, next) => {
  try {
    await Food.findByIdAndDelete(req.params.foodId);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting food:", error);
    res.status(500).json({ message: "Failed to delete food" });
  }
});

module.exports = router;
