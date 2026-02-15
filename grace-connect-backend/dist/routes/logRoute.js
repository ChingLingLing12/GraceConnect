"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logController_1 = __importDefault(require("../controllers/logController"));
const router = express_1.default.Router();
router.post('/logs', (req, res) => logController_1.default.createLog(req, res));
router.get('/logs', (req, res) => logController_1.default.getLogs(req, res));
exports.default = router;
//# sourceMappingURL=logRoute.js.map