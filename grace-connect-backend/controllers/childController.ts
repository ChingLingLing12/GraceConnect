import mongoose from "mongoose";
import childSchema from "../models/childModel";

const Child = mongoose.models.Child || mongoose.model("Child", childSchema);

export const childController = {
    
    createChild: async (req: any, res: any) => {
        const now = new Date();
        const formattedTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 19);
        try {
            const { firstName, lastName, age, cell, signedIn } = req.body;
            if (!firstName || !lastName || !cell) {
                return res.status(400).json({ success: false, error: 'Missing required fields' });
            }
            const newChild = new Child({ firstName, lastName, age, cell, signedIn: signedIn, lastSignedIn: formattedTime, lastSignedOut: formattedTime });
            console.log("Creating child:", newChild);
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
            const children = await Child.find().populate('records');
            
            const formattedChildren = children.map(child => {
                const childObj = child.toObject();
                if (childObj.records && Array.isArray(childObj.records)) {
                    childObj.records = childObj.records.map((record: any) => ({
                        ...record,
                        timestamp: new Date(record.timestamp).toLocaleString()
                    }));
                }
                return childObj;
            });
            
            res.status(200).json({ success: true, children: formattedChildren });
        } catch (error) {
            console.error("Error retrieving children:", error);
            res.status(500).json({ success: false, error: 'Failed to retrieve children' });
        }
    },

    editChild: async (req: any, res: any) => {
        try {
            const { _id } = req.params;
            const updates = req.body;
            
            // Handle timestamp updates for sign-in/sign-out
            if ('signedIn' in updates) {
                const now = new Date();
                const formattedTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
                    .toISOString()
                    .slice(0, 19);
                
                if (updates.signedIn) {
                    updates.lastSignedIn = formattedTime;
                } else {
                    updates.lastSignedOut = formattedTime;
                }
            }
            
            if (updates.records) {
                const selectedChild = await Child.findById(_id);
                if (selectedChild) {
                    updates.records = [...(selectedChild.records || []), ...(Array.isArray(updates.records) ? updates.records : [updates.records])];
                }
            }
            
            const updatedChild = await Child.findByIdAndUpdate(_id, updates, { new: true }).populate('records');
            if (!updatedChild) {
                return res.status(404).json({ success: false, error: 'Child not found' });
            }
            
            // Format timestamps in populated records
            const childObj = updatedChild.toObject();
            if (childObj.records && Array.isArray(childObj.records)) {
                childObj.records = childObj.records.map((record: any) => ({
                    ...record,
                    timestamp: new Date(record.timestamp).toLocaleString()
                }));
            }
            
            res.status(200).json({ success: true, child: childObj });
        } catch (error) {
            console.error("Error updating child:", error);
            res.status(500).json({ success: false, error: 'Failed to update child' });
        }
    }
}
export default childController
