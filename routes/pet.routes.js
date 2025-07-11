const Contact = require("../models/Contact.model");
const Medication = require("../models/Medication.model");
const Vaccination = require("../models/Vaccination.model");
const Weight = require("../models/Weight.model");
const Food = require("../models/Food.model");


const router = require("express").Router();
const Pet = require("../models/Pet.model");
const breeds = require("../data/breeds.json");
const express = require("express");
const multer = require("multer");
const { storage } = require("../config/cloudinary.config");
const upload = multer({ storage });

const { isAuthenticated } = require("../middleware/jwt.middleware");

// GET list of breeds
router.get("/breeds", (req, res) => {
  res.json(breeds);
});



// IMAGE UPLOAD
router.post("/upload", isAuthenticated, upload.single("image"), async (req, res) => {
  try {
    const imageUrl = req.file.path;

    const pet = await Pet.findOneAndUpdate(
      { owner: req.payload._id },
      { image: imageUrl },
      { new: true }
    );

    res.json({ imageUrl });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
});

router.get("/public/:petId", async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.petId);

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    // Alle relevant data for pet:
    const [
      contacts,
      medications,
      vaccinations,
      weights,
      food
    ] = await Promise.all([
      Contact.find({ pet: pet._id }),
      Medication.find({ pet: pet._id }),
      Vaccination.find({ pet: pet._id }),
      Weight.find({ pet: pet._id }),
      Food.findOne({ pet: pet._id }),
    ]);

    // combine in 1 JSON-object:
    res.json({
      ...pet.toObject(),
      contacts,
      medications,
      vaccinations,
      weights,
      food,
    });
  } catch (err) {
    console.error("Error fetching pet:", err);
    res.status(500).json({ message: "Error fetching pet" });
  }
});


// POST /api/pet CREATE PET
router.post("/", isAuthenticated, async (req, res) => {
  try {
    // Check if user already has a pet
    const existingPet = await Pet.findOne({ owner: req.payload._id });
    if (existingPet) {
      return res.status(400).json({ message: "You already have a pet" });
    }

    const petData = {
      ...req.body,
      owner: req.payload._id,
    };

    const newPet = await Pet.create(petData);
    res.status(201).json(newPet);
  } catch (error) {
    console.error("Error creating pet:", error.message);
    res.status(500).json({ message: "Error creating pet", error });
  }
});


// READ all pets from the logged-in user
router.get("/", isAuthenticated, (req, res, next) => {
  Pet.find({ owner: req.payload._id })
    .then((pets) => res.json(pets))
    .catch((error) => next(error));
});



// UPDATE pet
router.put("/:petId", (req, res, next) => {
  Pet.findByIdAndUpdate(req.params.petId, req.body, { new: true })
    .then((updated) => res.json(updated))
    .catch((error) => {
      next(error);
    });
});

// DELETE pet
router.delete("/:petId", (req, res, next) => {
  Pet.findByIdAndDelete(req.params.petId)
    .then(() => res.status(204).send())
    .catch((error) => {
      next(error);
    });
});

// ADD a weight entry
router.post("/:petId/weights", (req, res, next) => {
  const { weight, date } = req.body;
  Pet.findByIdAndUpdate(
    req.params.petId,
    { $push: { weightHistory: { weight, date } } },
    { new: true }
  )
    .then((updatedPet) => res.json(updatedPet))
    .catch((error) => next(error));
});

// DELETE a weight entry by id
router.delete("/:petId/weights/entry/:entryId", (req, res, next) => {
  Pet.findByIdAndUpdate(
    req.params.petId,
    { $pull: { weightHistory: { _id: req.params.entryId } } },
    { new: true }
  )
    .then((updatedPet) =>
      updatedPet
        ? res.json(updatedPet)
        : res.status(404).json({ error: "Pet not found" })
    )
    .catch((error) => next(error));
});

// GET all weight entries for a pet
router.get("/:petId/weights", (req, res, next) => {
  Pet.findById(req.params.petId)
    .then((pet) => {
      if (!pet) return res.status(404).json({ error: "Pet not found" });
      res.json(pet.weightHistory);
    })
    .catch((error) => next(error));
});


// ADD a vaccination entry
router.post("/:petId/vaccinations", (req, res, next) => {
  const { name, date, nextDueDate } = req.body;
  Pet.findByIdAndUpdate(
    req.params.petId,
    { $push: { vaccinations: { name, date, nextDueDate } } },
    { new: true }
  )
    .then((updatedPet) => res.json(updatedPet))
    .catch((error) => next(error));
});

// DELETE a vaccination entry by index
router.delete("/:petId/vaccinations/:index", (req, res, next) => {
  Pet.findById(req.params.petId)
    .then((pet) => {
      if (!pet) return res.status(404).json({ error: "Pet not found" });
      pet.vaccinations.splice(req.params.index, 1);
      return pet.save();
    })
    .then((updatedPet) => res.json(updatedPet))
    .catch((error) => next(error));
});

// READ one pet by ID
router.get("/:petId", (req, res, next) => {
  Pet.findById(req.params.petId)
    .then((pet) =>
      pet
        ? res.json(pet)
        : res.status(404).json({ error: "Pet not found" })
    )
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
