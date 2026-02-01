const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({

    taskId: {type: String, unique: true},
    name: String,
    description: String,
    deadline: Date,    


    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"

    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model("Task", taskSchema);