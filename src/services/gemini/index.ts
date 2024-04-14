import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import systemPrompt from './prompts/system';

class GeminiServiceClass {
    private categories: HarmCategory[] = [
        HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        HarmCategory.HARM_CATEGORY_HARASSMENT,
        HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    ];
    private systemPrompt;
    private model;

    constructor(apiKey: string, systemPrompt: string) {
        const genAi = new GoogleGenerativeAI(apiKey);
        this.model = genAi.getGenerativeModel({
            model: 'gemini-pro',
            safetySettings: this.categories.map((category) => ({
                category: category,
                threshold: HarmBlockThreshold.BLOCK_NONE,
            })),
        });
        this.systemPrompt = systemPrompt;
    }
    public async generate(input: string) {
        const response = await this.model.generateContent({
            contents: [
                {
                    parts: [
                        {
                            text:
                                systemPrompt +
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
                            text: systemPrompt + input,
                        },
                    ],
                    role: 'user',
                },
            ],
        });
        return response.response.text();
    }
}

const GeminiService = new GeminiServiceClass(process.env.GEMINI_API_KEY!, systemPrompt);
export default GeminiService;
