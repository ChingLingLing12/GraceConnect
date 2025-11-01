import mongoose from 'mongoose';
import logSchema from '../models/logModel';

const Log = mongoose.models.Log || mongoose.model('Log', logSchema);

const logController = {
    createLog: async (req: any, res: any) => {
        try {
            const { message } = req.body;
            if (!message) {
                return res.status(400).json({ success: false, error: 'Message is required' });
            }
            const newLog = new Log({ message: message});
            await newLog.save();
            
            // Format response with local time
            const responseLog = {
                ...newLog.toObject(),
                timestamp: newLog.timestamp.toLocaleString()
            };
            res.status(201).json({ success: true, log: responseLog });
        } catch (error) {
            console.error("Detailed error:", error);
            res.status(500).json({ 
                success: false, 
                error: 'Failed to create log',
                details: error instanceof Error ? error.message : String(error)
            });
        }
    },
    
    getLogs: async (req: any, res: any) => {
        try {
            const logs = await Log.find();
            const formattedLogs = logs.map(log => ({
                ...log.toObject(),
                timestamp: log.timestamp.toLocaleString()
            }));
            
            res.status(200).json({ success: true, logs: formattedLogs });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Failed to retrieve logs' });
        }
    },
}
export default logController;