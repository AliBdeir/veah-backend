"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callRequestSchema = void 0;
const express_joi_validation_1 = require("express-joi-validation");
const joi_1 = __importDefault(require("joi"));
exports.callRequestSchema = joi_1.default.object({
    predefinedInformation: joi_1.default.object({
        address: joi_1.default.string().required(),
        name: joi_1.default.string().required(),
        age: joi_1.default.number().required(),
        sex: joi_1.default.string().optional(),
        emergencyInformation: joi_1.default.string().optional(),
        emergencyContacts: joi_1.default.array()
            .items(joi_1.default.object({
            name: joi_1.default.string().required(),
            phone: joi_1.default.string().required(),
            email: joi_1.default.string().email().required(),
            relationship: joi_1.default.string().required(),
        }))
            .optional(),
        healthInformation: joi_1.default.object({
            bloodType: joi_1.default.string().optional(),
            allergies: joi_1.default.array().items(joi_1.default.string()).optional(),
            medications: joi_1.default.array().items(joi_1.default.string()).optional(),
            conditions: joi_1.default.array().items(joi_1.default.string()).optional(),
        }).optional(),
    }).required(),
});
