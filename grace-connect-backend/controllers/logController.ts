import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({ 
    message: String, 
    timestamp: { type: Date, default: Date.now } 
});

const Log = mongoose.models.Log || mongoose.model('Log', logSchema);

const logController = {
    createLog: async (req: any, res: any) => {
        try {
            const { message } = req.body;
            if (!message) {
                return res.status(400).json({ success: false, error: 'Message is required' });
            }
            
            const newLog = new Log({ message });
            await newLog.save();
            res.status(201).json({ success: true, log: newLog });
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
            res.status(200).json({ success: true, logs });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Failed to retrieve logs' });
        }
    },
}
export default logController;