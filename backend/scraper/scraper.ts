import { Bet } from "shared/models/bet"
import { League } from "shared/models/league"
import { getCountryCodeByName } from '../util/countrycode';
import { createLeague, findLeague } from "../database/dto/league";
import axios from "axios"
import { load } from 'cheerio'

export async function scrape(url: string) {
    if (url.includes("flashscore")) {
        return await scrapeFlashscore(url)
    }
    if (url.includes("fupa.net")) {
        return await scrapeFupa(url)
    }
}

async function scrapeFupa(url: string) {
    try {
        const apiUrl = "https://api.fupa.net/v1/matches/" + extractFupaMatchString(url)
        const response = await axios.get(apiUrl)
        const matchData = response.data
        const bet: Bet = {
            date: new Date(matchData["kickoff"]),
            eventId: undefined,
            leagueId: undefined,
            question: undefined,
            result: undefined,
            type: "1X2",
            typeCondition: undefined,
            id: undefined,
            teamHomeDescription: matchData["homeTeamName"],
            teamHomeUrl: matchData["homeTeam"]["image"]["path"] + "128x128.jpeg",
            teamAwayDescription: matchData["awayTeamName"],
            teamAwayUrl: matchData["awayTeam"]["image"]["path"] + "128x128.jpeg",
            url: url
        }

        const league: League = {
            sportTypeId: 1,
            countryCode: "DE",
            id: undefined,
            name: matchData["round"]["competitionSeason"]["name"]
        }

        const existingLeague = await findLeague(league.name, league.sportTypeId, league.countryCode)

        if (existingLeague) {
            bet.leagueId = existingLeague.id
        } else {
            const newLeague: League = await createLeague(league)
            bet.leagueId = newLeague.id
        }

        return {
            bet: bet,
            league: league,
            sportName: "Fußball",
            country: "Deutschland"
        }


    } catch (error) {
        console.error('Error:', error)
    }
}

function extractFupaMatchString(url: string) {
    const match = url.match(/\/match\/([^/]+)/);
    return match ? match[1] : null;
}
async function scrapeFlashscore(url: string) {
    try {
        const response = await axios.get(url)
        const $ = load(response.data)

        let script: string | null = null
        $('body script').each((index, element) => {
            const scriptContent = $(element).html()
            if (scriptContent && scriptContent.startsWith('\n\t\t\twindow.environment')) {
                script = $(element).html()
                return false
            }
        })

        if (script) {
            return await extractDataFromFlashscoreScript(script, url)
        } else {
            console.log('Desired script not found')
        }

    } catch (error) {
        console.error('Error:', error)
    }
}

async function extractDataFromFlashscoreScript(script: string, url: string) {
    const cleanedScript = script
        .trim().replace("window.environment = ", '')
        .slice(0, -1)

    let obj = JSON.parse(cleanedScript)

    const bet: Bet = {
        date: new Date(obj['common_feed'].find(e => e.hasOwnProperty('DC'))['DC'] * 1000),
        eventId: undefined,
        leagueId: undefined,
        question: undefined,
        result: undefined,
        type: "1X2",
        typeCondition: undefined,
        id: undefined,
        teamHomeDescription: obj['participantsData']['home'][0]['name'],
        teamHomeUrl: obj['participantsData']['home'][0]['image_path'],
        teamAwayDescription: obj['participantsData']['away'][0]['name'],
        teamAwayUrl: obj['participantsData']['away'][0]['image_path'],
        url: url
    }

    let language = "de"
    if (url.includes("flashcore.com")) {
        language = "en"
    }

    const league: League = {
        sportTypeId: parseInt(obj["sport_id"]),
        countryCode: getCountryCodeByName(obj['header']['tournament']['category'], language),
        id: undefined,
        name: obj['header']['tournament']['link'].split('/').filter(s => s)[2]
    }

    const existingLeague = await findLeague(league.name, league.sportTypeId, league.countryCode)

    if (existingLeague) {
        bet.leagueId = existingLeague.id
    } else {
        const newLeague: League = await createLeague(league)
        bet.leagueId = newLeague.id
    }

    return {
        bet: bet,
        league: league,
        sportName: obj['sport'],
        country: obj['header']['tournament']['category']
    }
}