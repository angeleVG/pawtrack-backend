const router = require("express").Router();
const Pet = require("../models/Pet.model");

// CREATE pet
router.post("/", (req, res, next) => {
  Pet.create(req.body)
    .then((pet) => res.status(201).json(pet))
    .catch((error) => {
      next(error);
    });
});

// READ all pets
router.get("/", (req, res, next) => {
  Pet.find()
    .then((pets) => res.json(pets))
    .catch((error) => {
      next(error);
    });
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

module.exports = router;
