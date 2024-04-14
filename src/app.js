"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validator = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const express_joi_validation_1 = require("express-joi-validation");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.validator = (0, express_joi_validation_1.createValidator)();
require("./controllers/call-controller");
const port = 44712;
exports.app.get('/', (req, res) => {
    res.send('Application works!');
});
exports.app.listen(port, () => {
    console.log(`Application started on port ${port}!`);
});
