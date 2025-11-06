import mongoose from "mongoose";
import houseHoldSchema from "../models/houseHoldModel";

const HouseHold = mongoose.models.HouseHold || mongoose.model("HouseHold", houseHoldSchema);

export const houseHoldController = {
    createHouseHold: async (req: any, res: any) => {
        try {
            const houseHold = new HouseHold(req.body);
            console.log('Creating Household with data:', req.body);
            const houseHoldList = await HouseHold.findOne({ guardianFirstName: req.body.guardianFirstName, guardianLastName: req.body.guardianLastName, email: req.body.email, phone: req.body.phone });

            if (houseHoldList) {
                console.log('Household already exists:', houseHoldList._id);
                if(houseHoldList.children.includes(...req.body.children)){
                    return res.status(400).json({ error: 'Children already exist in the household' });
                }
                req.body.children = [...new Set([...houseHoldList.children, ...req.body.children])];
                await HouseHold.findByIdAndUpdate(houseHoldList._id, req.body);
                return res.status(500).json({ error: 'Household already exists, updated' });
            }

            await houseHold.save();
            console.log('Current Households in DB:', houseHoldList);
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
            const { _id } = req.params;
            const updates = req.body;

            // If children array is provided, use $push to append
            if (updates.children) {
            const updatedHouseHold = await HouseHold.findByIdAndUpdate(
                _id,
                { $push: { children: { $each: updates.children } } },
                { new: true }
            );
            return res.status(200).json(updatedHouseHold);
            }

            // Otherwise, do a normal update
            const updatedHouseHold = await HouseHold.findByIdAndUpdate(_id, updates, { new: true });
            if (!updatedHouseHold) return res.status(404).json({ error: 'Household not found' });

            res.status(200).json(updatedHouseHold);
        } catch (error) {
            console.error('Error updating household:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
};
export default houseHoldController;
