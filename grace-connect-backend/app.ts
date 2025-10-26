import mongoose from "mongoose";
import logController from "./controllers/logController";
import 'dotenv/config';

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/graceconnect').then(() => {
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});

// Routes
app.get ('/api/logs', logController.getLogs);
app.post('/api/logs', logController.createLog);

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
