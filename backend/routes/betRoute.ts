import express, { Request, Response } from 'express';
import { createBet, getBet, updateBet } from '../database/dto/bet'

export const betRoute = express.Router()

betRoute.post('/bet', async (req: Request, res: Response): Promise<void> => {
    const bet = req.body

    try {
        const newBet = await createBet(bet)
        res.json({
            success: true,
            message: 'new bet with id ' + newBet.id + ' inserted'
        })
    } catch (e: any) {
        res.json({
            success: false,
            message: "ERROR while insertig a bet\n" + bet
        })
    }
})

betRoute.put('/bet', async (req: Request, res: Response): Promise<void> => {
    const bet = req.body

    try {
        const newBet = await updateBet(bet)
        res.json({
            success: true,
            message: 'updated bet with id ' + newBet.id
        })
    } catch (e: any) {
        res.json({
            success: false,
            message: "ERROR while updating a bet\n" + bet
        })
    }
})

betRoute.get('/bet', async (req:Request, res: Response): Promise<void> => {
    const betId = req.body.betId

    try {
        const bet = await getBet(betId)
        res.json({
            bet
        })
    } catch (e: any) {
        res.json({
            success: false,
            message: "ERROR while fetching a bet with id " + betId
        })
    }
})