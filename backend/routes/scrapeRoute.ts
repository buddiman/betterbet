import express, { Request, Response } from 'express';
import { scrape } from '../scraper/scraper'


export const scrapeRoute = express.Router()

scrapeRoute.post('/scrape', async (req:Request, res: Response): Promise<void> => {
    const url = req.body.url

    try {
        const scrapeData = await scrape(url)
        res.json({
            scrapeData
        })
    } catch (e: any) {
        res.json({
            success: false,
            message: "ERROR while scraping " + url
        })
    }
})