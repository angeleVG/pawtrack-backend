const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const petSchema = new Schema(
  {
    name: 
    { type: String, required: true },
    breed: String,
    birthDate: Date,

   

    food: {
      brand: String,
      product: String,
      portionSize: String,
      frequency: String,
        waterAmount: String,     
  snacksPerDay: String,
      notes: String
    },

    allergies: [String],

    // relationship between dog and owner
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },

  {
     // this object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true
  }
);

const Pet = model("Pet", petSchema);
module.exports = Pet;
