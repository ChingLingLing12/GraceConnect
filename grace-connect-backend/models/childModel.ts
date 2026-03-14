import mongoose from "mongoose";

const cellValues = ['Year 12', 'Year 11', 'Year 10', 'Year 9', 'Year 8', 'Year 7', 'Little Light [Kindy to PP]', 'Little Candle [Y1-Y2]', 'Lighthouse [Y3-Y4]', 'Flame [Y5]', 'Torch Bearer [Y6 above]'];

const childSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    age: Number,
    cell: { type: String },
    records: [ {type: mongoose.Schema.Types.ObjectId, ref: 'Log'} ],
    signedIn: { type: Boolean, default: false },
    lastSignedIn: { type: String},
    lastSignedOut: { type: String},
    oneTime: Boolean,
    ministry: {
        type: String,
        enum: ["youth", "sundayschool"],
        required: true
    },
});


export default childSchema;
