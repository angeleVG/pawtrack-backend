const router = require("express").Router();
const Medication = require("../models/Medication.model");
const Pet = require("../models/Pet.model");

// GET all medications
router.get("/", (req, res, next) => {
  Medication.find()
    .then((medications) => res.json(medications))
    .catch((err) => {
      console.error("Error fetching medications:", err);
      res.status(500).json({ message: "Failed to get medications" });
    });
});


// GET one medication by ID
router.get("/:id", (req, res, next) => {
  const { id } = req.params;

  Medication.findById(id)
    .then((medication) => {
      if (!medication) {
        return res.status(404).json({ message: "Medication not found" });
      }
      res.json(medication);
    })
    .catch((err) => {
      console.error("Error fetching medication:", err);
      res.status(500).json({ message: "Failed to fetch medication" });
    });
});


// CREATE medication + add reference to Pet
router.post("/", (req, res, next) => {
  const { name, purpose, dosage, startDate, endDate, petId } = req.body;

  Medication.create({ name, purpose, dosage, startDate, endDate, pet: petId })
    .then((newMedication) => {
      return Pet.findByIdAndUpdate(petId, {
        $push: { medications: newMedication._id },
      }).then(() => res.status(201).json(newMedication));
    })
    .catch((err) => {
      console.error("Error creating medication:", err);
      res.status(500).json({ message: "Failed to create medication" });
    });
});

// DELETE medication + remove reference from Pet
router.delete("/:id", (req, res, next) => {
  const { id } = req.params;

  Medication.findByIdAndDelete(id)
    .then((deletedMedication) => {
      if (!deletedMedication) {
        return res.status(404).json({ message: "Medication not found" });
      }
      return Pet.findByIdAndUpdate(deletedMedication.pet, {
        $pull: { medications: deletedMedication._id },
      }).then(() => res.json({ message: "Medication deleted" }));
    })
    .catch((err) => {
      console.error("Error deleting medication:", err);
      res.status(500).json({ message: "Failed to delete medication" });
    }); 
});

// GET all medications for a specific pet
router.get("/pet/:petId", (req, res, next) => {
  const { petId } = req.params;

  Medication.find({ pet: petId })
    .then((medications) => res.json(medications))
    .catch((err) => {
      console.error("Error fetching pet medications:", err);
      res.status(500).json({ message: "Failed to get pet medications" });
    });
});

// UPDATE medication
router.put("/:id", (req, res, next) => {
  const { id } = req.params;
  const updatedData = req.body;

  Medication.findByIdAndUpdate(id, updatedData, { new: true })
    .then((updatedMedication) => {
      if (!updatedMedication) {
        return res.status(404).json({ message: "Medication not found" });
      }
      res.json(updatedMedication);
    })
    .catch((err) => {
      console.error("Error updating medication:", err);
      res.status(500).json({ message: "Failed to update medication" });
    });
});

module.exports = router;
