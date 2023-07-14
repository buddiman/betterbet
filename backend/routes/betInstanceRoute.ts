import express, { Request, Response } from 'express';
import { createBet, getBet, getBetsForEvent, updateBet } from '../database/dto/bet'
import { createBetInstance, getBetInstance, updateBetInstance } from "../database/dto/betInstance";

export const betInstanceRoute = express.Router()

betInstanceRoute.post('/betInstance', async (req: Request, res: Response): Promise<void> => {
    const betInstance = req.body

    try {
        const newBetInstance = await createBetInstance(betInstance)
        res.json({
            success: true,
            message: 'new betInstance with id inserted: ' + newBetInstance
        })
    } catch (e: any) {
        res.json({
            success: false,
            message: "ERROR while insertig a betInstance"
        })
    }
})

betInstanceRoute.put('/betInstance', async (req: Request, res: Response): Promise<void> => {
    const betInstance = req.body

    try {
        const newBetInstance = await updateBetInstance(betInstance)
        res.json({
            success: true,
            message: 'updated betInstance ' + newBetInstance
        })
    } catch (e: any) {
        res.json({
            success: false,
            message: "ERROR while updating a betInstance\n" + betInstance
        })
    }
})

betInstanceRoute.get('/betInstance/:userId/:betId', async (req:Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.userId, 10)
    const betId = parseInt(req.params.betId, 10)

    try {
        const betInstance = await getBetInstance(betId, userId)
        res.json({
            betInstance
        })
    } catch (e: any) {
        res.json({
            success: false,
            message: "ERROR while fetching betInstance with userId: " + userId + " and betId: " + betId
        })
    }
})