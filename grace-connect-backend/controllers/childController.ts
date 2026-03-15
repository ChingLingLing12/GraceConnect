import mongoose from "mongoose";
import childSchema from "../models/childModel";

const Child =
  mongoose.models.Child ||
  mongoose.model("Child", childSchema);

const formatLogRecord = (record: any) => ({
  ...record,
  signInTime: record?.signInTime
    ? new Date(record.signInTime).toLocaleString()
    : null,
  signOutTime: record?.signOutTime
    ? new Date(record.signOutTime).toLocaleString()
    : null,
});

export const childController = {
  // CREATE CHILD
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
        ministry,
      } = req.body;

      if (!firstName || !lastName || !ministry) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields",
        });
      }

      if (!["youth", "sundayschool"].includes(ministry)) {
        return res.status(400).json({
          success: false,
          error: "Invalid ministry",
        });
      }

      const newChild = new Child({
        firstName,
        lastName,
        age,
        cell,
        signedIn: signedIn ?? false,
        oneTime: oneTime ?? false,
        ministry,
        records: Array.isArray(records) ? records : [],
        lastSignedIn: null,
        lastSignedOut: null,
      });

      await newChild.save();

      res.status(201).json({
        success: true,
        child: newChild,
      });
    } catch (error) {
      console.error("Error creating child:", error);
      res.status(500).json({
        success: false,
        error: "Failed to create child",
      });
    }
  },

  // GET CHILDREN
  getChildren: async (req: any, res: any) => {
    try {
      const { ministry } = req.query;

      const filter: any = {};
      if (ministry && ["youth", "sundayschool"].includes(ministry)) {
        filter.ministry = ministry;
      }

      const children = await Child.find(filter).populate("records").lean();

      const formattedChildren = children.map((child: any) => {
        if (Array.isArray(child.records)) {
          child.records = child.records.map(formatLogRecord);
        }
        return child;
      });

      res.status(200).json({
        success: true,
        children: formattedChildren,
      });
    } catch (error) {
      console.error("Error retrieving children:", error);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve children",
      });
    }
  },

  // GET SINGLE CHILD
  getChildById: async (req: any, res: any) => {
    try {
      const { _id } = req.params;

      const child = await Child.findById(_id).populate("records").lean();

      if (!child) {
        return res.status(404).json({
          success: false,
          error: "Child not found",
        });
      }

      const childObj: any = child;

      if (Array.isArray(childObj.records)) {
        childObj.records = childObj.records.map(formatLogRecord);
      }

      res.status(200).json({
        success: true,
        child: childObj,
      });
    } catch (error) {
      console.error("Error retrieving child:", error);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve child",
      });
    }
  },

  // EDIT CHILD
  editChild: async (req: any, res: any) => {
    try {
      const { _id } = req.params;
      const updates = req.body;

      const updateQuery: any = {};

      if ("firstName" in updates) updateQuery.firstName = updates.firstName;
      if ("lastName" in updates) updateQuery.lastName = updates.lastName;
      if ("age" in updates) updateQuery.age = updates.age;
      if ("cell" in updates) updateQuery.cell = updates.cell;
      if ("oneTime" in updates) updateQuery.oneTime = updates.oneTime;

      if (
        "ministry" in updates &&
        ["youth", "sundayschool"].includes(updates.ministry)
      ) {
        updateQuery.ministry = updates.ministry;
      }

      if ("signedIn" in updates) {
        updateQuery.signedIn = updates.signedIn;
      }

      if ("lastSignedIn" in updates) {
        updateQuery.lastSignedIn = updates.lastSignedIn;
      }

      if ("lastSignedOut" in updates) {
        updateQuery.lastSignedOut = updates.lastSignedOut;
      }

      if (updates.records) {
        updateQuery.$push = {
          records: updates.records,
        };
      }

      const updatedChild = await Child.findByIdAndUpdate(_id, updateQuery, {
        new: true,
      })
        .populate("records")
        .lean();

      if (!updatedChild) {
        return res.status(404).json({
          success: false,
          error: "Child not found",
        });
      }

      const childObj: any = updatedChild;

      if (Array.isArray(childObj.records)) {
        childObj.records = childObj.records.map(formatLogRecord);
      }

      res.status(200).json({
        success: true,
        child: childObj,
      });
    } catch (error) {
      console.error("Error updating child:", error);
      res.status(500).json({
        success: false,
        error: "Failed to update child",
      });
    }
  },

  // DELETE CHILD
  deleteChild: async (req: any, res: any) => {
    try {
      const { _id } = req.params;

      const deletedChild = await Child.findByIdAndDelete(_id);

      if (!deletedChild) {
        return res.status(404).json({
          success: false,
          error: "Child not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Child deleted",
        _id,
      });
    } catch (error) {
      console.error("Error deleting child:", error);
      res.status(500).json({
        success: false,
        error: "Failed to delete child",
      });
    }
  },
};

export default childController;