import { Bet } from "../../shared/models/bet"
import { League } from "../../shared/models/league"
import { Options } from "selenium-webdriver/firefox";
import { Builder, By } from "selenium-webdriver";

// const {Builder, By} = require('selenium-webdriver');

export async function scrape(url: string) {
    const ffOptions = new Options()
        .setBinary('C:\\Program Files\\Mozilla Firefox\\firefox.exe')       // TODO from env and OS specific
        .headless()
    const driver = await new Builder()
        .forBrowser('firefox')
        .setFirefoxOptions(ffOptions)
        .build()

    await driver.get(url)

    const scripts = await driver.findElements(By.tagName('script'))

    let fullScript: string

    for (const s of scripts) {
        const text = await s.getAttribute('innerHTML')
        if (text.startsWith('\n\t\t\twindow.environment')) {
            fullScript = text
                .trim().replace("window.environment = ", '')
                .slice(0, -1)
            break
        }
    }

    let obj = JSON.parse(fullScript)

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

    const league: League = {
        sportTypeId: undefined,
        countryCode: undefined,
        id: undefined,
        name: obj['header']['tournament']['tournament']

    }

    return {
        bet: bet,
        league: league,
        sportName: obj['sport'],
        country: obj['header']['tournament']['category']

    }
}