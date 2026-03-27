import mongoose from "mongoose";

const houseHoldSchema = new mongoose.Schema({
    guardianFirstName: String,
    guardianLastName: String,
    email: String,
    phone: String,
    secondaryGuardianFirstName: { type: String, default: "" },
    secondaryGuardianLastName: { type: String, default: "" },
    secondaryGuardianPhone: { type: String, default: "" },

    children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Child' }],
    ministry: {
        type: String,
        enum: ["youth", "sundayschool"],
        required: true
    }
});

export default houseHoldSchema;