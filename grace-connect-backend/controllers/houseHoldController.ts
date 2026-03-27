import mongoose from "mongoose";
import houseHoldSchema from "../models/houseHoldModel";

const HouseHold =
  mongoose.models.HouseHold ||
  mongoose.model("HouseHold", houseHoldSchema);

export const houseHoldController = {
  // ✅ CREATE
  createHouseHold: async (req: any, res: any) => {
    try {
      const {
        guardianFirstName,
        guardianLastName,
        email,
        phone,
        children = [],
        ministry,
        secondaryGuardianFirstName,
        secondaryGuardianLastName,
        secondaryGuardianPhone,
      } = req.body;

      if (!ministry) {
        return res.status(400).json({ success: false, error: "Ministry is required" });
      }

      if (!guardianFirstName || !guardianLastName || !email || !phone) {
        return res.status(400).json({
          success: false,
          error: "Primary guardian first name, last name, email, and phone are required",
        });
      }

      // Find existing household WITH SAME MINISTRY
      const existing = await HouseHold.findOne({
        guardianFirstName,
        guardianLastName,
        email,
        phone,
        ministry,
      });

      if (existing) {
        const updatedExisting = await HouseHold.findByIdAndUpdate(
          existing._id,
          {
            $addToSet: { children: { $each: children } },
            $set: {
              secondaryGuardianFirstName: secondaryGuardianFirstName || "",
              secondaryGuardianLastName: secondaryGuardianLastName || "",
              secondaryGuardianPhone: secondaryGuardianPhone || "",
            },
          },
          { new: true }
        );

        return res.status(200).json({
          success: true,
          message: "Household already exists, children updated",
          household: updatedExisting,
          _id: existing._id,
        });
      }

      const newHouseHold = new HouseHold({
        guardianFirstName,
        guardianLastName,
        email,
        phone,
        ministry,
        children,
        secondaryGuardianFirstName: secondaryGuardianFirstName || "",
        secondaryGuardianLastName: secondaryGuardianLastName || "",
        secondaryGuardianPhone: secondaryGuardianPhone || "",
      });

      await newHouseHold.save();

      return res.status(201).json({
        success: true,
        message: "Household created successfully",
        household: newHouseHold,
        _id: newHouseHold._id,
      });
    } catch (error) {
      console.error("Error creating household:", error);
      return res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  },

  // ✅ GET (FILTER BY MINISTRY)
  getHouseHolds: async (req: any, res: any) => {
    try {
      const ministry = req.query.ministry;

      if (!ministry || !["youth", "sundayschool"].includes(ministry)) {
        return res.status(400).json({
          success: false,
          error: "Valid ministry is required",
        });
      }

      const houseHolds = await HouseHold.find({ ministry }).populate(
        "children",
        "firstName lastName age cell signedIn ministry"
      );

      return res.status(200).json({
        success: true,
        households: houseHolds,
      });
    } catch (error) {
      console.error("Error fetching households:", error);
      return res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  },

  // ✅ EDIT
  editHouseHold: async (req: any, res: any) => {
    try {
      const { _id } = req.params;
      const {
        children,
        secondaryGuardianFirstName,
        secondaryGuardianLastName,
        secondaryGuardianPhone,
        ...otherUpdates
      } = req.body;

      const updateQuery: any = {
        $set: {
          ...otherUpdates,
        },
      };

      if (secondaryGuardianFirstName !== undefined) {
        updateQuery.$set.secondaryGuardianFirstName = secondaryGuardianFirstName || "";
      }

      if (secondaryGuardianLastName !== undefined) {
        updateQuery.$set.secondaryGuardianLastName = secondaryGuardianLastName || "";
      }

      if (secondaryGuardianPhone !== undefined) {
        updateQuery.$set.secondaryGuardianPhone = secondaryGuardianPhone || "";
      }

      if (children && Array.isArray(children) && children.length > 0) {
        updateQuery.$addToSet = { children: { $each: children } };
      }

      const updatedHouseHold = await HouseHold.findByIdAndUpdate(_id, updateQuery, {
        new: true,
      });

      if (!updatedHouseHold) {
        return res.status(404).json({
          success: false,
          error: "Household not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Household updated successfully",
        household: updatedHouseHold,
      });
    } catch (error) {
      console.error("Error updating household:", error);
      return res.status(500).json({
        success: false,
        error: "Internal server error",
      });
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
          error: "Household not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Household deleted",
        _id,
      });
    } catch (error) {
      console.error("Error deleting household:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to delete household",
      });
    }
  },
};

export default houseHoldController;