const mongoose = require("mongoose");

const TaskSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  taskName: {
    type: String,
    required: true,
  },
  taskDescription: {
    type: String,
  },
  taskStatus: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Task", TaskSchema);
