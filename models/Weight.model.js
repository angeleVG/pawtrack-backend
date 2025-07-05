const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const weightSchema = new Schema(
  {
    pet: { type: Schema.Types.ObjectId, ref: "Pet", required: true },
    value: { type: Number, required: true },
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const Weight = model("Weight", weightSchema);
module.exports = Weight;