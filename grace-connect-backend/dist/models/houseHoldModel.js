"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const houseHoldSchema = new mongoose_1.default.Schema({
    guardianFirstName: String,
    guardianLastName: String,
    email: String,
    phone: String,
    children: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Child' }],
});
exports.default = houseHoldSchema;
//# sourceMappingURL=houseHoldModel.js.map