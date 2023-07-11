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
    //await testdb()
    await scrape('https://www.flashscore.com/match/bFKqfulf/#/match-summary/match-summary')
    console.log(`Example app listening on port ${port}`)
});


async function testdb() {
    await createEvent({
        id: undefined,
        name: "Spieltag 1",
        description: null,
        from: new Date(),
        to: new Date()
    })

    await createSportType({
        id: undefined,
        name: "Fußball"
    })

    await createLeague({
        id: undefined,
        name: "Bundesliga",
        countryCode: "de"
    })

    const b: Bet = {
        date: new Date(),
        eventId: 1,
        id: undefined,
        leagueId: 1,
        question: "Question",
        result: "result",
        sportTypeId: 1,
        teamAwayDescription: "awaydesc",
        teamAwayUrl: "awayurl",
        teamHomeDescription: "homedesc",
        teamHomeUrl: "homeurl",
        type: "type",
        typeCondition: "typecond",
        url: "httpURL"
    }

    const test = await createBet(b)
    console.log(test)

    const ret = await getBet(0)
    console.log(ret)
}
