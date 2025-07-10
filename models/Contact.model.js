const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const contactSchema = new Schema({
  pet: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
}, { timestamps: true });

module.exports = model("Contact", contactSchema);
