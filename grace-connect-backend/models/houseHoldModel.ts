import mongoose from "mongoose";

const houseHoldSchema = new mongoose.Schema({
    guardianFirstName: String,
    guardianLastName: String,
    email: String,
    phone: String,
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Child' }],
});

export default houseHoldSchema;