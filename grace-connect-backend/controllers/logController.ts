import mongoose from "mongoose";
import logSchema from "../models/logModel";
import childSchema from "../models/childModel";

const Log = mongoose.models.Log || mongoose.model("Log", logSchema);
const Child = mongoose.models.Child || mongoose.model("Child", childSchema);

const logController = {
  signIn: async (req: any, res: any) => {
    try {
      const { childId } = req.body;

      if (!childId) {
        return res.status(400).json({
          success: false,
          error: "childId is required",
        });
      }

      const child = await Child.findById(childId);

      if (!child) {
        return res.status(404).json({
          success: false,
          error: "Child not found",
        });
      }

      const existingSession = await Log.findOne({
        child: childId,
        signOutTime: null,
      });

      if (existingSession) {
        return res.status(400).json({
          success: false,
          error: "Child already signed in",
        });
      }

      const now = new Date();

      const newLog = await Log.create({
        child: childId,
        signInTime: now,
        signOutTime: null,
      });

      await Child.findByIdAndUpdate(childId, {
        signedIn: true,
        lastSignedIn: now.toLocaleString(),
        $push: { records: newLog._id },
      });

      res.status(201).json({
        success: true,
        log: newLog,
      });
    } catch (error) {
      console.error("Error signing in:", error);
      res.status(500).json({
        success: false,
        error: "Failed to sign in",
      });
    }
  },

  signOut: async (req: any, res: any) => {
    try {
      const { childId } = req.body;

      if (!childId) {
        return res.status(400).json({
          success: false,
          error: "childId is required",
        });
      }

      const child = await Child.findById(childId);

      if (!child) {
        return res.status(404).json({
          success: false,
          error: "Child not found",
        });
      }

      const now = new Date();

      const log = await Log.findOneAndUpdate(
        {
          child: childId,
          signOutTime: null,
        },
        {
          signOutTime: now,
        },
        {
          sort: { signInTime: -1 },
          new: true,
        }
      );

      if (!log) {
        return res.status(404).json({
          success: false,
          error: "No active session found",
        });
      }

      await Child.findByIdAndUpdate(childId, {
        signedIn: false,
        lastSignedOut: now.toLocaleString(),
      });

      res.status(200).json({
        success: true,
        log,
      });
    } catch (error) {
      console.error("Error signing out:", error);
      res.status(500).json({
        success: false,
        error: "Failed to sign out",
      });
    }
  },

  getLogs: async (req: any, res: any) => {
    try {
      const { ministry } = req.query;

      let logs = await Log.find()
        .populate({
          path: "child",
          match:
            ministry && ["youth", "sundayschool"].includes(ministry)
              ? { ministry }
              : {},
        })
        .sort({ signInTime: -1 })
        .lean();

      if (ministry) {
        logs = logs.filter((log: any) => log.child);
      }

      const formattedLogs = logs.map((log: any) => ({
        ...log,
        signInTime: log.signInTime
          ? new Date(log.signInTime).toLocaleString()
          : null,
        signOutTime: log.signOutTime
          ? new Date(log.signOutTime).toLocaleString()
          : null,
      }));

      res.status(200).json({
        success: true,
        logs: formattedLogs,
      });
    } catch (error) {
      console.error("Error retrieving logs:", error);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve logs",
      });
    }
  },
};

export default logController;