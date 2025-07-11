// models/Medication.model.js
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const medicationSchema = new Schema({
  name: String,
  purpose: String,
  dosage: String,
  startDate: Date,
  endDate: Date,
pet: { type: Schema.Types.ObjectId, ref: "Pet", required: true }, // connecting the medication to the pet
});

module.exports = model("Medication", medicationSchema);
