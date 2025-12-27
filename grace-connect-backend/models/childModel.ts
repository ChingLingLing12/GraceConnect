import mongoose from "mongoose";

const cellValues = ['Year 12 Cell', 'Year 8/9 Cell', 'Year 10/11 Cell', 'Year 7 Cell', 'Little Light [Kindy to PP]', 'Little Candle [Y1-Y2]', 'Lighthouse [Y3-Y4]', 'Flame [Y5]', 'Torch Bearer [Y6 above]'];

const childSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    age: Number,
    cell: { type: String, enum: cellValues },
    records: [ {type: mongoose.Schema.Types.ObjectId, ref: 'Log'} ],
    signedIn: { type: Boolean, default: false },
    lastSignedIn: { type: String},
    lastSignedOut: { type: String},
    oneTime: Boolean
});


export default childSchema;
