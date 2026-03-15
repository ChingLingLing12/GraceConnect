import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  child: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Child", 
    required: true 
  },
  signInTime: { 
    type: Date, 
    required: true 
  },
  signOutTime: { 
    type: Date, 
    default: null 
  }
});

export default logSchema;