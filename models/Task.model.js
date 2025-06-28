const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const taskSchema = new Schema(

    // relationship between walks and pet
  {
    dog: { type: Schema.Types.ObjectId, ref: "Pet", required: true }, 

    type: {
      type: String,
      enum: ["walk", "play", "train"], // for future reference
      required: true,
    },

    timesPerDay: {
      type: Number,
      default: 0,
    },

   duration: {
  type: Number, // in minutes
  default: 0
},

dailyWalks: {
  durations: [Number],
  notes: String
}

  },
  {
    timestamps: true,  // this object adds extra properties: `createdAt` and `updatedAt`
  }
);

const Task = model("Task", taskSchema);
module.exports = Task;
