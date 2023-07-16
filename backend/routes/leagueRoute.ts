import express, { Request, Response } from 'express';
import { createLeague, getAllLeagues, getLeague, updateLeague } from '../database/dto/league'

export const leagueRoute = express.Router()

leagueRoute.post('/league', async (req: Request, res: Response): Promise<void> => {
    const league = req.body

    try {
        const newLeague = await createLeague(league)
        res.json({
            success: true,
            message: 'new league with id ' + newLeague.id + ' inserted'
        })
    } catch (e: any) {
        res.json({
            success: false,
            message: "ERROR while insertig a league\n" + league
        })
    }
})

leagueRoute.put('/league', async (req: Request, res: Response): Promise<void> => {
    const league = req.body

    try {
        const newLeague = await updateLeague(league)
        res.json({
            success: true,
            message: 'updated league with id ' + newLeague.id
        })
    } catch (e: any) {
        res.json({
            success: false,
            message: "ERROR while updating a league\n" + league
        })
    }
})

leagueRoute.get('/league/:leagueId', async (req:Request, res: Response): Promise<void> => {
    const leagueId = parseInt(req.params.leagueId, 10)

    try {
        const league = await getLeague(leagueId)
        res.json({
            success: true,
            message: 'fetched league with id ' + league.id
        })
    } catch (e: any) {
        res.json({
            success: false,
            message: "ERROR while fetching a bet with id " + leagueId
        })
    }
})

leagueRoute.get('/leagues', async (req:Request, res: Response): Promise<void> => {
    try {
        const leagues = await getAllLeagues()
        res.json({
            league: leagues,
            success: true,
            message: 'fetched all leagues with id '
        })
    } catch (e: any) {
        res.json({
            success: false,
            message: "ERROR while fetching all leagues"
        })
    }
})