import { Bet } from "../shared/models/bet"
import { routes } from './routes'

import express, { Express } from "express";
import cors from "cors";

import { createBet, getBet } from "./database/dto/bet";
import { createEvent } from "./database/dto/event";
import { createSportType } from "./database/dto/sportType";
import { createLeague } from "./database/dto/league";
import { scrape } from "./scraper/scraper";

const app: Express = express();

app.use(express.json());
app.use(cors());
app.use('/', routes)

const port = process.env.PORT || 8000;

app.listen(port, async () => {
    console.log("STARTUP")
    console.log(`Example app listening on port ${port}`)
});
