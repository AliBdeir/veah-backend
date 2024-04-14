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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const Client_1 = require("elevenlabs/Client");
class ElevenServiceClass {
    constructor(apiKey, voice) {
        this.voice = voice;
        this.eleven = new Client_1.ElevenLabsClient({
            apiKey: apiKey,
        });
    }
    convertTextToSpeech(text) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            try {
                const audio = yield this.eleven.textToSpeech.convert(this.voice, {
                    text: text,
                    voice_settings: {
                        style: 0.2,
                        stability: 0.5,
                        similarity_boost: 0.8,
                        use_speaker_boost: true,
                    },
                });
                const chunks = [];
                try {
                    for (var _d = true, audio_1 = __asyncValues(audio), audio_1_1; audio_1_1 = yield audio_1.next(), _a = audio_1_1.done, !_a; _d = true) {
                        _c = audio_1_1.value;
                        _d = false;
                        const chunk = _c;
                        chunks.push(chunk);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = audio_1.return)) yield _b.call(audio_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                return Buffer.concat(chunks);
            }
            catch (error) {
                console.error('Error converting text to speech:', error);
                throw new Error('Failed to convert text to speech');
            }
        });
    }
}
const ElevenService = new ElevenServiceClass(process.env.VEAH_ELEVEN_API_KEY, process.env.VEAH_ELEVEN_VOICE);
exports.default = ElevenService;
