const { Schema, model } = require("mongoose");

const foodSchema = new Schema(
  {
    pet: {
      type: Schema.Types.ObjectId,
      ref: "Pet",
      required: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    product: {
      type: String,
      trim: true,
    },
    portionSize: {
      type: Number, 
      min: 0,
    },
    frequency: {
      type: Number, 
      min: 0,
    },
    waterAmount: {
      type: Number, 
      min: 0,
    },
    snacksPerDay: {
      type: Number,
      min: 0,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Food", foodSchema);
