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

    walksPerDay: {
      type: Number,
      default: 0,
    },

    durations: [Number],

    notes: {
      type: String,
    }
  },
  {
    timestamps: true,  // this object adds extra properties: `createdAt` and `updatedAt`
  }
);

const Task = model("Task", taskSchema);
module.exports = Task;
