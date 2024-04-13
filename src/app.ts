import express from 'express';
import { Request, Response } from 'express';

const app = express();
const port = 44712;

app.get('/', (req: Request, res: Response) => {
    res.send('Application works!');
});

app.listen(port, () => {
    console.log(`Application started on port ${port}!`);
});
