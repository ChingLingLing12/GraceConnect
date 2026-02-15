"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const logController_1 = __importDefault(require("./controllers/logController"));
const childController_1 = __importDefault(require("./controllers/childController"));
const houseHoldController_1 = __importDefault(require("./controllers/houseHoldController"));
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
// CORS configuration
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', "https://grace-connect.vercel.app"],
    credentials: true,
    optionsSuccessStatus: 200
}));
app.use(express.json());
mongoose_1.default.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/graceconnect').then(() => {
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});
// Routes
app.get('/api/log', logController_1.default.getLogs);
app.post('/api/log', logController_1.default.createLog);
app.get('/api/youth', childController_1.default.getChildren);
app.post('/api/youth', childController_1.default.createChild);
app.put('/api/youth/:_id', childController_1.default.editChild);
app.delete('/api/youth/:_id', childController_1.default.deleteChild);
app.get('/api/household', houseHoldController_1.default.getHouseHolds);
app.post('/api/household', houseHoldController_1.default.createHouseHold);
app.put('/api/household/:_id', houseHoldController_1.default.editHouseHold);
app.delete('/api/household/:_id', houseHoldController_1.default.deleteHouseHold);
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map