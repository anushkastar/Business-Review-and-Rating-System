const mongoose = require("mongoose");

const BusinessSchema = new mongoose.Schema(
  {
    name: { 
        type: String, 
        required: true
    },
    photo:{
        type:String,
        required:true,
    },
    location: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    approved: {
        type: Boolean,
        default: false,
    },
    contact: {
        type: Number,
        required: true,
    },
    avgRating: {
        type: Number,
        default: 0,
        min:0,
        max:5
    },
},
  { timestamps: true }
);

module.exports = mongoose.model("Business", BusinessSchema);
