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
const twilio_1 = __importDefault(require("twilio"));
const uuid_1 = require("uuid");
const app_1 = require("../../app");
const blobs_1 = __importDefault(require("../../services/azure/blobs"));
const eleven_1 = __importDefault(require("../../services/eleven"));
const gemini_1 = __importDefault(require("../../services/gemini"));
const schemas_1 = require("./schemas");
const text_compiler_1 = require("./text-compiler");
const VoiceResponse_1 = __importDefault(require("twilio/lib/twiml/VoiceResponse"));
const accountSid = process.env.VEAH_TWILIO_ACCOUNT_SID;
const authToken = process.env.VEAH_TWILIO_AUTH_TOKEN;
const phone = process.env.VEAH_TWILIO_PHONE_NUMBER;
console.log(accountSid, authToken, phone);
const client = (0, twilio_1.default)(accountSid, authToken);
app_1.app.post('/call', app_1.validator.body(schemas_1.callRequestSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // ! Step 1: Generate the text
        const info = (0, text_compiler_1.getPrompt)(req.body.predefinedInformation);
        const geminiResponse = yield gemini_1.default.generate(info);
        // ! Step 2: Convert text to speech
        const audioBuffer = yield eleven_1.default.convertTextToSpeech(geminiResponse);
        // ! Step 3: Upload audio to Azure Blob Storage
        const blobName = `${(0, uuid_1.v4)()}.mp3`;
        const blobUrl = yield blobs_1.default.uploadBlob(blobName, audioBuffer);
        console.log('Created blob url: ', blobUrl);
        // ! Step 4: Make the call
        const voiceCall = new VoiceResponse_1.default();
        voiceCall.play(blobUrl);
        yield client.calls.create({
            from: phone,
            to: '+12489544144',
            twiml: voiceCall,
        });
        res.send('Call has been made');
    }
    catch (error) {
        console.error('Failed to handle request:', error);
        res.status(500).send('Failed to convert text to speech');
    }
}));
// app.get('/ai', async (req: Request, res: Response) => {
//     try {
//         res.send(
//             await GeminiService.generate(
//                 'House intruder\nAli Bdeir\nAge: 20 sex: male\nconditions: diabetic\n17185 Francavilla Dr Livonia MI 48152',
//             ),
//         );
//     } catch (err) {
//         res.status(500).send('Failed to generate content');
//     }
// });
