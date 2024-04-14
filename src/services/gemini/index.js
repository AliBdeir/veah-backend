"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const generative_ai_1 = require("@google/generative-ai");
const system_1 = __importDefault(require("./prompts/system"));
class GeminiServiceClass {
    constructor(apiKey, systemPrompt) {
        this.categories = [
            generative_ai_1.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            generative_ai_1.HarmCategory.HARM_CATEGORY_HARASSMENT,
            generative_ai_1.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            generative_ai_1.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        ];
        const genAi = new generative_ai_1.GoogleGenerativeAI(apiKey);
        this.model = genAi.getGenerativeModel({
            model: 'gemini-pro',
            safetySettings: this.categories.map((category) => ({
                category: category,
                threshold: generative_ai_1.HarmBlockThreshold.BLOCK_NONE,
            })),
        });
        this.systemPrompt = systemPrompt;
    }
    generate(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.model.generateContent({
                contents: [
                    {
                        parts: [
                            {
                                text: system_1.default +
                                    `\nchoking
                    diabetic, recent esophagus surgery
                    age 20, sex: male
                    17185 francavilla dr livonia mi 48152`,
                            },
                        ],
                        role: 'user',
                    },
                    {
                        parts: [
                            {
                                text: 'The Address of the Emergency is one seven one eight five Francavilla Drive. I am VEAH, an AI assistant calling on behalf of Ali Bdeir. The individual is experiencing choking and has a history of heart conditions and recent esophageal surgery. Blood type and allergies information is not provided. Please send immediate help',
                            },
                        ],
                        role: 'model',
                    },
                    {
                        parts: [
                            {
                                text: system_1.default + input,
                            },
                        ],
                        role: 'user',
                    },
                ],
            });
            return response.response.text();
        });
    }
}
const GeminiService = new GeminiServiceClass(process.env.GEMINI_API_KEY, system_1.default);
exports.default = GeminiService;
