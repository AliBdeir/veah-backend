import express from 'express';
import { Request, Response } from 'express';
import { createValidator } from 'express-joi-validation';
import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseconfig';
dotenv.config();
export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Add this line
export const validator = createValidator();
export const firebaseApp = initializeApp(firebaseConfig);
import './controllers/call-controller';

const port = 44712;

app.get('/', (req: Request, res: Response) => {
    res.send('Application works!');
});

app.listen(port, () => {
    console.log(`Application started on port ${port}!`);
});
