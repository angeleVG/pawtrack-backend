const router = require("express").Router();
const Pet = require("../models/Pet.model");
const breeds = require("../data/breeds.json");


const { isAuthenticated } = require("../middleware/jwt.middleware");

// READ all pets from the logged-in user
router.get("/", isAuthenticated, (req, res, next) => {
  Pet.find({ owner: req.payload._id })
    .then((pets) => res.json(pets))
    .catch((error) => next(error));
});



// GET list of breeds
router.get("/breeds", (req, res) => {
  res.json(breeds);
});

// CREATE pet
router.post("/", (req, res, next) => {
  Pet.create(req.body)
    .then((pet) => res.status(201).json(pet))
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

// UPDATE food info
router.put("/:petId/food", (req, res, next) => {
  const { brand, product, portionSize, frequency, notes } = req.body;

  Pet.findByIdAndUpdate(
    req.params.petId,
    {
      food: { brand, product, portionSize, frequency, notes }
    },
    { new: true }
  )
    .then((updatedPet) => res.json(updatedPet))
    .catch((error) => next(error));
});


// GET food info for a pet
router.get("/:petId/food", (req, res, next) => {
  Pet.findById(req.params.petId)
    .then((pet) => {
      if (!pet) return res.status(404).json({ error: "Pet not found" });
      res.json(pet.food);
    })
    .catch((error) => next(error));
});

// DELETE food info
router.delete("/:petId/food", (req, res, next) => {
  Pet.findByIdAndUpdate(
    req.params.petId,
    { $unset: { food: "" } },
    { new: true }
  )
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
