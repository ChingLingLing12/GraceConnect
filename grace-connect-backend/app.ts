import mongoose from "mongoose";
import logController from "./controllers/logController";
import childController from "./controllers/childController";
import houseHoldController from "./controllers/houseHoldController";
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
app.get ('/api/log', logController.getLogs);
app.post('/api/log', logController.createLog);

app.get('/api/youth', childController.getChildren);
app.post('/api/youth', childController.createChild);

app.get('/api/household', houseHoldController.getHouseHolds);
app.post('/api/household', houseHoldController.createHouseHold);


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
