import mongoose from "mongoose";
import houseHoldSchema from "../models/houseHoldModel";

const HouseHold =
  mongoose.models.HouseHold ||
  mongoose.model("HouseHold", houseHoldSchema);

export const houseHoldController = {

  // ✅ CREATE
  createHouseHold: async (req: any, res: any) => {
    try {
      const { guardianFirstName, guardianLastName, email, phone, children, ministry } = req.body;

      if (!ministry) {
        return res.status(400).json({ error: "Ministry is required" });
      }

      // Find existing household WITH SAME MINISTRY
      const existing = await HouseHold.findOne({
        guardianFirstName,
        guardianLastName,
        email,
        phone,
        ministry
      });

      if (existing) {
        // Add new children safely without duplicates
        await HouseHold.findByIdAndUpdate(
          existing._id,
          { $addToSet: { children: { $each: children } } },
          { new: true }
        );

        return res.status(200).json({
          message: "Household already exists, children updated",
          _id: existing._id
        });
      }

      const newHouseHold = new HouseHold(req.body);
      await newHouseHold.save();

      res.status(201).json(newHouseHold);

    } catch (error) {
      console.error("Error creating household:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },


  // ✅ GET (FILTER BY MINISTRY)
  getHouseHolds: async (req: any, res: any) => {
    try {
      const ministry = req.query.ministry;

      if (!ministry || !["youth", "sundayschool"].includes(ministry)) {
        return res.status(400).json({ error: "Valid ministry is required" });
      }

      const houseHolds = await HouseHold.find({ ministry })
        .populate("children", "firstName lastName age cell signedIn ministry");

      res.status(200).json({ success: true, houseHolds });
    } catch (error) {
      console.error("Error fetching households:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },


  // ✅ EDIT
  editHouseHold: async (req: any, res: any) => {
    try {
      const { _id } = req.params;
      const updates = req.body;

      // Safely add children without duplicates
      if (updates.children) {
        const updatedHouseHold = await HouseHold.findByIdAndUpdate(
          _id,
          { $addToSet: { children: { $each: updates.children } } },
          { new: true }
        );

        return res.status(200).json(updatedHouseHold);
      }

      const updatedHouseHold = await HouseHold.findByIdAndUpdate(
        _id,
        updates,
        { new: true }
      );

      if (!updatedHouseHold)
        return res.status(404).json({ error: "Household not found" });

      res.status(200).json(updatedHouseHold);

    } catch (error) {
      console.error("Error updating household:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },


  // ✅ DELETE
  deleteHouseHold: async (req: any, res: any) => {
    try {
      const { _id } = req.params;

      const deleted = await HouseHold.findByIdAndDelete(_id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: "Household not found"
        });
      }

      res.status(200).json({
        success: true,
        message: "Household deleted",
        _id
      });

    } catch (error) {
      console.error("Error deleting household:", error);
      res.status(500).json({
        success: false,
        error: "Failed to delete household"
      });
    }
  }
};

export default houseHoldController;
