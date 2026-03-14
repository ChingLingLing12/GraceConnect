import mongoose from "mongoose";
import childSchema from "../models/childModel";

const Child =
  mongoose.models.Child ||
  mongoose.model("Child", childSchema);

export const childController = {

  // ✅ CREATE CHILD
  createChild: async (req: any, res: any) => {
    try {
      const {
        firstName,
        lastName,
        age,
        cell,
        signedIn,
        oneTime,
        records,
        ministry
      } = req.body;

      if (!firstName || !lastName || !ministry) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields"
        });
      }

      console.log("Incoming youth:", req.body);

      const now = new Date().toISOString();

      const newChild = new Child({
        firstName,
        lastName,
        age,
        cell,
        signedIn: signedIn ?? false,
        oneTime: oneTime ?? false,
        ministry,
        lastSignedIn: signedIn ? now : null,
        lastSignedOut: !signedIn ? now : null,
        records: records || []
      });

      await newChild.save();

      res.status(201).json({
        success: true,
        child: newChild
      });

    } catch (error) {
      console.error("Error creating child:", error);
      res.status(500).json({
        success: false,
        error: "Failed to create child"
      });
    }
  },


  // ✅ GET CHILDREN (FILTER BY MINISTRY)
  getChildren: async (req: any, res: any) => {
    try {
      const { ministry } = req.query;

      const filter = ministry ? { ministry } : {};

      const children = await Child.find(filter)
        .populate("records");

      const formattedChildren = children.map(child => {
        const obj = child.toObject();

        if (obj.records && Array.isArray(obj.records)) {
          obj.records = obj.records.map((record: any) => ({
            ...record,
            timestamp: record.timestamp
              ? new Date(record.timestamp).toLocaleString()
              : null
          }));
        }

        return obj;
      });

      res.status(200).json({
        success: true,
        children: formattedChildren
      });

    } catch (error) {
      console.error("Error retrieving children:", error);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve children"
      });
    }
  },


  // ✅ EDIT CHILD
  editChild: async (req: any, res: any) => {
    try {
      const { _id } = req.params;
      const updates = req.body;

      const now = new Date().toISOString();

      // Handle sign in/out timestamps
      if ("signedIn" in updates) {
        if (updates.signedIn) {
          updates.lastSignedIn = now;
        } else {
          updates.lastSignedOut = now;
        }
      }

      // Safely add records without duplicates
      if (updates.records) {
        await Child.findByIdAndUpdate(
          _id,
          { $addToSet: { records: { $each: [].concat(updates.records) } } }
        );
        delete updates.records;
      }

      const updatedChild = await Child.findByIdAndUpdate(
        _id,
        updates,
        { new: true }
      ).populate("records");

      if (!updatedChild) {
        return res.status(404).json({
          success: false,
          error: "Child not found"
        });
      }

      res.status(200).json({
        success: true,
        child: updatedChild
      });

    } catch (error) {
      console.error("Error updating child:", error);
      res.status(500).json({
        success: false,
        error: "Failed to update child"
      });
    }
  },


  // ✅ DELETE CHILD
  deleteChild: async (req: any, res: any) => {
    try {
      const { _id } = req.params;

      const deletedChild = await Child.findByIdAndDelete(_id);

      if (!deletedChild) {
        return res.status(404).json({
          success: false,
          error: "Child not found"
        });
      }

      res.status(200).json({
        success: true,
        message: "Child deleted",
        _id
      });

    } catch (error) {
      console.error("Error deleting child:", error);
      res.status(500).json({
        success: false,
        error: "Failed to delete child"
      });
    }
  }
};

export default childController;
