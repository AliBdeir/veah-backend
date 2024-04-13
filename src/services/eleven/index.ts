import axios from 'axios';
import { ElevenLabsClient } from 'elevenlabs/Client';

class ElevenServiceClass {
    private eleven: ElevenLabsClient;
    private voice: string;
    constructor(apiKey: string, voice: string) {
        this.voice = voice;
        this.eleven = new ElevenLabsClient({
            apiKey: apiKey,
        });
    }

    public async convertTextToSpeech(text: string): Promise<Buffer> {
        try {
            const audio = await this.eleven.textToSpeech.convert(this.voice, {
                text: text,
                voice_settings: {
                    style: 0.2,
                    stability: 0.5,
                    similarity_boost: 0.8,
                    use_speaker_boost: true,
                },
            });
            const chunks: Buffer[] = [];
            for await (const chunk of audio) {
                chunks.push(chunk);
            }
            return Buffer.concat(chunks);
        } catch (error) {
            console.error('Error converting text to speech:', error);
            throw new Error('Failed to convert text to speech');
        }
    }
}

const ElevenService = new ElevenServiceClass(process.env.VEAH_ELEVEN_API_KEY!, process.env.VEAH_ELEVEN_VOICE!);
export default ElevenService;
