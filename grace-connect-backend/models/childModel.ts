import mongoose from "mongoose";

const cellValues = ['Year 12 Cell', 'Year 8/9 Cell', 'Year 10/11 Cell', 'Year 7 Cell', 'Sunday School'];

const childSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    age: Number,
    cell: { type: String, enum: cellValues },
    records: [ {type: mongoose.Schema.Types.ObjectId, ref: 'Log'} ],
    signedIn: { type: Boolean, default: false },
    lastSignedIn: { type: String},
    lastSignedOut: { type: String},
});


export default childSchema;