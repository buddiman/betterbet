import express, { Request, Response } from 'express'
import { getBetInstancesByBetId, updateBetInstance } from "../database/dto/betInstance";
import { calculatePointsForBet } from "../util/points";
import { getBet, updateBet } from "../database/dto/bet";
import { getBetInstancesPointsPerUserId } from "../database/dto/statistics";
import { getAllUsers } from "../database/dto/user";
import { User } from "shared/models/user";

export const manageRoute = express.Router()

manageRoute.post('/evaluate', async (req: Request, res: Response): Promise<void> => {
    const resultInformations = req.body

    try {
        const betInstances = await getBetInstancesByBetId(resultInformations.betId)
        for (const betInstance of betInstances) {
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

manageRoute.get('/userpoints', async (req: Request, res: Response): Promise<void> => {
    const points = await getBetInstancesPointsPerUserId()
    const users: User[] = await getAllUsers()

    const userPoints = []
    for (const point of points) {
        userPoints.push({
            username: users.find(e => e.id === point.userId).username,
            points: point._sum.points
        })
    }

    try {
        res.json({
            points: userPoints.sort((a, b) => (a.points > b.points ? -1 : 1)),
            success: true
        })
    } catch (e: any) {
        res.json({
            success: false,
            message: "ERROR"
        })
    }

})