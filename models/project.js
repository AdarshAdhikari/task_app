import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,

  // features of the project
  features: [
    {
      title: String,
      value: String,
    },
  ],

  // all tasks related to project
  tasks: [
    {
      name: String,
      description: String,
      completed: {
        type: Boolean,
        default: false,
      },
    },
  ],

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.model("Project", projectSchema);
