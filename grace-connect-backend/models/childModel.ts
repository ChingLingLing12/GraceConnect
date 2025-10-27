import mongoose from "mongoose";

const cellValues = ['Year 12', 'Year 8/9 Cell', 'Year 10/11 Cell', 'Year 7 Cell'];

const childSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    age: Number,
    cell: { type: String, enum: cellValues },
    records: [ {type: mongoose.Schema.Types.ObjectId, ref: 'Log'} ],
    isSignedin: { type: Boolean, default: false },
});

export default childSchema;