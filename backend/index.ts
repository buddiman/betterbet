import { routes } from './routes'

import express, { Express } from "express";
import cors from "cors";


const app: Express = express();

app.use(express.json());
app.use(cors());
app.use('/', routes)

const port = process.env.PORT || 8000;

app.listen(port, async () => {
    console.log("STARTUP")
    console.log(`Example app listening on port ${port}`)
});
