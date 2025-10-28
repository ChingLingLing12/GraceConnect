import mongoose from "mongoose";
import childSchema from "../models/childModel";

const Child = mongoose.models.Child || mongoose.model("Child", childSchema);

export const childController = {
    createChild: async (req: any, res: any) => {
        try {
            const { firstName, lastName, age, cell, isSignedin } = req.body;
            if (!firstName || !lastName || !cell) {
                return res.status(400).json({ success: false, error: 'Missing required fields' });
            }
            const newChild = new Child({ firstName, lastName, age, cell, isSignedin });
            await newChild.save();

            const responseChild = {
                ...newChild.toObject(),
            };
            res.status(201).json({ success: true, child: responseChild });
        } catch (error) {
            console.error("Error creating child:", error);
            res.status(500).json({ success: false, error: 'Failed to create child' });
        }
    },

    getChildren: async (req: any, res: any) => {        // Retrieve all children
        try {
            const children = await Child.find();
            res.status(200).json({ success: true, children });
        } catch (error) {
            console.error("Error retrieving children:", error);
            res.status(500).json({ success: false, error: 'Failed to retrieve children' });
        }
    },

    editChild: async (req: any, res: any) => {
        try {
            const { id } = req.params;
            const updates = req.body;
            
            if (updates.records) {
                const selectedChild = await Child.findById(id);
                if (selectedChild) {
                    updates.records = [...(selectedChild.records || []), ...(Array.isArray(updates.records) ? updates.records : [updates.records])];
                }
            }
            
            const updatedChild = await Child.findByIdAndUpdate(id, updates, { new: true });
            if (!updatedChild) {
                return res.status(404).json({ success: false, error: 'Child not found' });
            }
            res.status(200).json({ success: true, child: updatedChild });
        } catch (error) {
            console.error("Error updating child:", error);
            res.status(500).json({ success: false, error: 'Failed to update child' });
        }
    }
}
export default childController
