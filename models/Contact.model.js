const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const contactSchema = new Schema({
  pet: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
   relation: {
    type: String,
    required: true,
    enum: [
      "owner",
      "vet",
      "animal ambulance",
      "groomer",
      "trainer",
      "petsitter",
      "walker",
      "breeder",
      "insurance",
      "emergency contact",
      "shelter",
      "boarding",
      "pharmacy",
      "other"
    ],
    default: "other"
  },
}, { timestamps: true });

module.exports = model("Contact", contactSchema);
