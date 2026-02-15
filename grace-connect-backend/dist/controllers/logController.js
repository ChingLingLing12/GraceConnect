"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const logModel_1 = __importDefault(require("../models/logModel"));
const Log = mongoose_1.default.models.Log || mongoose_1.default.model('Log', logModel_1.default);
const logController = {
    createLog: async (req, res) => {
        try {
            const { message } = req.body;
            if (!message) {
                return res.status(400).json({ success: false, error: 'Message is required' });
            }
            const newLog = new Log({ message: message });
            await newLog.save();
            // Format response with local time
            const responseLog = {
                ...newLog.toObject(),
                timestamp: newLog.timestamp.toLocaleString()
            };
            res.status(201).json({ success: true, log: responseLog });
        }
        catch (error) {
            console.error("Detailed error:", error);
            res.status(500).json({
                success: false,
                error: 'Failed to create log',
                details: error instanceof Error ? error.message : String(error)
            });
        }
    },
    getLogs: async (req, res) => {
        try {
            const logs = await Log.find();
            const formattedLogs = logs.map(log => ({
                ...log.toObject(),
                timestamp: log.timestamp.toLocaleString()
            }));
            res.status(200).json({ success: true, logs: formattedLogs });
        }
        catch (error) {
            res.status(500).json({ success: false, error: 'Failed to retrieve logs' });
        }
    },
};
exports.default = logController;
//# sourceMappingURL=logController.js.map