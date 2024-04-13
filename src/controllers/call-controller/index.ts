import { ValidatedRequest } from 'express-joi-validation';
import { app, validator } from '../../app';
import { CallRequestSchema, callRequestSchema } from './schemas';

app.post('/call', validator.body(callRequestSchema), (req: ValidatedRequest<CallRequestSchema>, res) => {
    res.send({
        name: `Hello, ${req.body.predefinedInformation.address}!`,
    });
});
