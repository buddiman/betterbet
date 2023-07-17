import express, { Request, Response } from 'express'
import { BetInstance } from "shared/models/betInstance";
import { getBetInstancesByBetId, updateBetInstance } from "../database/dto/betInstance";
import { calculatePointsForBet } from "../util/points";
import { getBet, updateBet } from "../database/dto/bet";

export const manageRoute = express.Router()

manageRoute.post('/evaluate', async (req: Request, res: Response): Promise<void> => {
    const resultInformations = req.body

    // fetch betInstances for Bet id
    // compare every betInstance and update points
    // updateBetObject with result

    try {
        const betInstances = await getBetInstancesByBetId(resultInformations.betId)
        for(const betInstance of betInstances) {
            betInstance.points = calculatePointsForBet(resultInformations.result, resultInformations.type, betInstance.userBet)
            await updateBetInstance(betInstance)
        }
        const bet = await getBet(resultInformations.betId)
        bet.result = resultInformations.result
        await updateBet(bet)

        res.json({
            success: true,
            message: 'Bet with id ' + resultInformations.betId + ' evaluated'
        })
    } catch (e: any) {
        res.json({
            success: false,
            message: "ERROR while evaluation bet with id " + resultInformations.betId
        })
    }
})