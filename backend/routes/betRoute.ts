import express, { Request, Response } from 'express';
import {
    createBet,
    deleteBet,
    getBet,
    getBetsForEvent,
    getNotEvaluatedBetsInThePast,
    updateBet
} from '../database/dto/bet'
import { deleteBetInstancesByBetId } from "../database/dto/betInstance";

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

betRoute.delete('/bet/:deleteId', async (req:Request, res: Response): Promise<void> => {
    const deleteId = parseInt(req.params.deleteId, 10)
    console.log("deleteId: " + deleteId)
    try {
        const y = await deleteBetInstancesByBetId(deleteId)
        const x = await deleteBet(deleteId)
        res.json({
            success: true,
            message: "Deleted bet and betInstances with id " + deleteId
        })
    } catch (e: any) {
        res.json({
            success: false,
            message: "ERROR while deleting bet with id " + deleteId
        })
    }
})

betRoute.get('/bets/:eventId', async (req:Request, res: Response): Promise<void> => {
    console.log(req.params)
    const eventId = parseInt(req.params.eventId, 10)
    try {
        const bets = await getBetsForEvent(eventId)
        res.json({
            bets
        })
    } catch (e: any) {
        res.json({
            success: false,
            message: "ERROR while fetching bets for event with id " + eventId
        })
    }
})

betRoute.get('/unevaluatedBets', async (req:Request, res: Response): Promise<void> => {
    try {
        const bets = await getNotEvaluatedBetsInThePast()
        res.json({
            bets
        })
    } catch (e: any) {
        res.json({
            success: false,
            message: "ERROR while fetching not evaluated bets in the past"
        })
    }
})