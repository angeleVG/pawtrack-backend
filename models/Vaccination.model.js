const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const vaccinationSchema = new Schema({
  pet: { type: Schema.Types.ObjectId, ref: "Pet", required: true },
  name: { type: String, required: true },
  dateGiven: { type: Date, required: true },
  expiryDate: { type: Date },
  vet: { type: String },
  batchNumber: { type: String },
  notes: { type: String }
});

module.exports = model("Vaccination", vaccinationSchema);
