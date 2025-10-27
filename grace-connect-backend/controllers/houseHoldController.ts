import mongoose from "mongoose";
import houseHoldSchema from "../models/houseHoldModel";

const HouseHold = mongoose.models.HouseHold || mongoose.model("HouseHold", houseHoldSchema);

export const houseHoldController = {
    createHouseHold: async (req: any, res: any) => {
        try {
            const houseHold = new HouseHold(req.body);
            await houseHold.save();
            res.status(201).json(houseHold);
        } catch (error) {
            console.error('Error creating household:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    getHouseHolds: async (req: any, res: any) => {
        try {
            const houseHolds = await HouseHold.find().populate('children', 'firstName lastName age cell isSignedin');
            res.status(200).json(houseHolds);
        } catch (error) {
            console.error('Error fetching households:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
};
export default houseHoldController;