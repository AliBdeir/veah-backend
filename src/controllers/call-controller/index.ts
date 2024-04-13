import { ValidatedRequest } from 'express-joi-validation';
import twilio from 'twilio';
import VoiceResponse from 'twilio/lib/twiml/VoiceResponse';
import { app, validator } from '../../app';
import { CallRequestSchema, callRequestSchema } from './schemas';
import ElevenService from '../../services/eleven';
import { v4 as uuid } from 'uuid';
import BlobsService from '../../services/azure/blobs';

const accountSid = process.env.VEAH_TWILIO_ACCOUNT_SID;
const authToken = process.env.VEAH_TWILIO_AUTH_TOKEN;
const phone = process.env.VEAH_TWILIO_PHONE_NUMBER;
console.log(accountSid, authToken, phone);
const client = twilio(accountSid, authToken);

app.post('/call', validator.body(callRequestSchema), async (req: ValidatedRequest<CallRequestSchema>, res) => {
    try {
        // ! Step 1: Convert text to speech
        const audioBuffer: Buffer = await ElevenService.convertTextToSpeech(req.body.predefinedInformation.address);
        // ! Step 2: Upload audio to Azure Blob Storage
        const blobName = `${uuid()}.mp3`;
        const blobUrl = await BlobsService.uploadBlob(blobName, audioBuffer);

        res.send({
            url: blobUrl,
        });
    } catch (error) {
        console.error('Failed to handle request:', error);
        res.status(500).send('Failed to convert text to speech');
    }
});
