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

    editHouseHold: async (req: any, res: any) => {
        try {
            const { id } = req.params;
            const updates = req.body;
            const updatedHouseHold = await HouseHold.findByIdAndUpdate(id, updates, { new: true });
            if (!updatedHouseHold) {
                return res.status(404).json({ error: 'Household not found' });
            }
            res.status(200).json(updatedHouseHold);
        } catch (error) {
            console.error('Error updating household:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};
export default houseHoldController;