import mongoose from "mongoose";
import logController from "./controllers/logController";
import childController from "./controllers/childController";
import houseHoldController from "./controllers/houseHoldController";
import authRoutes from "./routes/authRoutes";
import { protect } from "./middleware/authMiddleware";
import 'dotenv/config';
import cors from 'cors';

const express = require('express');
const app = express();
const port = process.env.PORT || 4000;

// CORS configuration
app.use(cors({
    origin: ['http://localhost:3000', 
        'http://127.0.0.1:3000',
        "https://www.graceconnect.au",
        'https://graceconnect.au'
    ],
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
app.use("/api/auth", authRoutes);
app.post('/api/sundayschool', childController.createChild);
app.get ('/api/log', logController.getLogs);
app.post('/api/log', logController.createLog);
app.post('/api/youth', childController.createChild);
app.put('/api/sundayschool/:_id', childController.editChild);
app.put('/api/youth/:_id', childController.editChild);
app.post('/api/youth/household', houseHoldController.createHouseHold);
app.post('/api/sundayschool/household', houseHoldController.createHouseHold);
app.put('/api/household/:_id', houseHoldController.editHouseHold);

app.use(protect); // everything below requires login

app.get('/api/youth', childController.getChildren);
app.get('/api/sundayschool', childController.getChildren);
app.delete('/api/youth/:_id', childController.deleteChild);
app.delete('/api/sundayschool/:_id', childController.deleteChild);

app.get('/api/youth/household', houseHoldController.getHouseHolds);
app.get('/api/sundayschool/household', houseHoldController.getHouseHolds);
app.delete('/api/household/:_id', houseHoldController.deleteHouseHold);
app.listen(port, () => {
    console.log(`Server listening at ${port}`);
});
