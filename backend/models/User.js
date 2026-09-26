const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
            trim: true
        },

        email:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
         
        password:{
            type: String,
            required: true
        },

        about:{
            type: String,
            default: ""
        },

        teachSkills:{
            type: [String],
            default: []
        },

        learnSkills:{
            type: [String],
            default: []
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);