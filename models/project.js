const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: String,
    description: String,


//features of the projects
    features:[
        {
            title: String,
            value: String
        }
    ],

    //all the tasks related to project
    tasks: [
        {

            name : String,
            description: String,
            completed: {type: Boolean, default: false}
        }
    ],

    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

})

module.exports = mongoose.model("project", projectSchema);