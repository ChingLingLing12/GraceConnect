import mongoose from "mongoose";
import logController from "./controllers/logController";
import childController from "./controllers/childController";
import houseHoldController from "./controllers/houseHoldController";
import 'dotenv/config';
import cors from 'cors';

const express = require('express');
const app = express();
const port = process.env.PORT || 4000;

// CORS configuration
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000',"https://grace-connect.vercel.app"],
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/graceconnect').then(() => {
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});

// Routes
app.get ('/api/log', logController.getLogs);
app.post('/api/log', logController.createLog);

app.get('/api/youth', childController.getChildren);
app.post('/api/youth', childController.createChild);
app.put('/api/youth/:_id', childController.editChild);

app.get('/api/household', houseHoldController.getHouseHolds);
app.post('/api/household', houseHoldController.createHouseHold);
app.put('/api/household/:_id', houseHoldController.editHouseHold);

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
