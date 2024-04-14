import { ValidatedRequest } from 'express-joi-validation';
import twilio from 'twilio';
import VoiceResponse from 'twilio/lib/twiml/VoiceResponse';
import { v4 as uuid } from 'uuid';
import { app, validator } from '../..';
import BlobsService from '../../services/azure/blobs';
import ElevenService from '../../services/eleven';
import GeminiService from '../../services/gemini';
import { CallRequestSchema, callRequestSchema } from './schemas';
import { getPrompt } from './text-compiler';
import FirebaseService from '../../services/firebase/firebase';

const accountSid = process.env.VEAH_TWILIO_ACCOUNT_SID;
const authToken = process.env.VEAH_TWILIO_AUTH_TOKEN;
const phone = process.env.VEAH_TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);
const self = process.env.VEAH_SELF!;
const firebaseService = new FirebaseService(); // Initialized Firebase service

app.post('/call', validator.body(callRequestSchema), async (req: ValidatedRequest<CallRequestSchema>, res) => {
    try {
        const initialInfo = getPrompt(req.body.predefinedInformation);
        const initialResponse = await GeminiService.generate(initialInfo);

        const initialAudioBuffer = await ElevenService.convertTextToSpeech(initialResponse);
        const initialBlobName = `${uuid()}.mp3`;
        const initialBlobUrl = await BlobsService.uploadBlob(initialBlobName, initialAudioBuffer);

        // Create a new chat session
        const sessionId = await firebaseService.createChatSession({
            messages: [
                {
                    senderId: 'VEAH',
                    text: initialResponse,
                    timestamp: Date.now(),
                },
            ],
        });

        const voiceResponse = new VoiceResponse();
        voiceResponse.play(initialBlobUrl);
        const gather = voiceResponse.gather({
            input: ['speech'],
            timeout: 5,
            action: `${self}/handle-response?sessionId=${sessionId}`,
        });
        gather.say({ voice: 'alice' }, 'Any questions?');

        await client.calls.create({
            from: phone!,
            to: '+12489544144',
            twiml: voiceResponse.toString(),
        });

        res.send('Call initiated with VEAH interaction');
    } catch (error) {
        console.error('Failed to initiate call:', (error as Error).message);
        res.status(500).send('Failed to process call setup');
    }
});

app.post('/handle-response', async (req, res) => {
    const sessionId = req.query.sessionId;
    const speechResult = req.body.SpeechResult;

    const sessionData = await firebaseService.getChatSession(sessionId as string);
    if (!sessionData) {
        return res.status(404).send('Session not found');
    }

    const responseText = await GeminiService.generate(
        speechResult + '\nPrevious Messages:\n' + sessionData.messages.map((m) => m.text).join('\n'),
    );
    const responseAudioBuffer = await ElevenService.convertTextToSpeech(responseText);
    const responseBlobName = `${uuid()}.mp3`;
    const responseBlobUrl = await BlobsService.uploadBlob(responseBlobName, responseAudioBuffer);

    // Update session data with new message
    await firebaseService.appendToChatSession(sessionId as string, {
        senderId: '911 Operator',
        text: speechResult,
        timestamp: Date.now(),
    });
    await firebaseService.appendToChatSession(sessionId as string, {
        senderId: 'VEAH',
        text: responseText,
        timestamp: Date.now(),
    });

    const response = new VoiceResponse();
    response.play(responseBlobUrl);
    response.gather({
        input: ['speech'],
        timeout: 5,
        action: `${self}/handle-response?sessionId=${sessionId}`, // Recursive handling
    });

    res.type('text/xml');
    res.send(response.toString());
});
