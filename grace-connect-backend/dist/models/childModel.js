"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const cellValues = ['Year 12 Cell', 'Year 8/9 Cell', 'Year 10/11 Cell', 'Year 7 Cell', 'Little Light [Kindy to PP]', 'Little Candle [Y1-Y2]', 'Lighthouse [Y3-Y4]', 'Flame [Y5]', 'Torch Bearer [Y6 above]'];
const childSchema = new mongoose_1.default.Schema({
    firstName: String,
    lastName: String,
    age: Number,
    cell: { type: String, enum: cellValues },
    records: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Log' }],
    signedIn: { type: Boolean, default: false },
    lastSignedIn: { type: String },
    lastSignedOut: { type: String },
    oneTime: Boolean
});
exports.default = childSchema;
//# sourceMappingURL=childModel.js.map