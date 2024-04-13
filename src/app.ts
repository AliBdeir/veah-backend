import express from 'express';
import { Request, Response } from 'express';
import { createValidator } from 'express-joi-validation';

export const app = express();
app.use(express.json());
export const validator = createValidator();
import './controllers/call-controller';

const port = 44712;

app.get('/', (req: Request, res: Response) => {
    res.send('Application works!');
});

app.listen(port, () => {
    console.log(`Application started on port ${port}!`);
});
