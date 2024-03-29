import express, { Request, Response } from 'express'
import { getBetInstancesByBetId, updateBetInstance } from "../database/dto/betInstance";
import { calculatePointsForBet } from "../util/points";
import { getBet, getPlayerPointsPerEvent, updateBet } from "../database/dto/bet";
import { getBetInstancesPointsPerUserId, getEventsWithMissingBetInstances } from "../database/dto/statistics";
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
    const userPointsPerEvent = await getPlayerPointsPerEvent()
    const userWins = []

    for(const user of users) {
        userWins.push({
            id: user.id,
            wins: 0
        })
    }


    for(const userPointsData of userPointsPerEvent) {
        for(const userPointData of userPointsData.pointsPerUser) {
            if(userPointData.points !== 0 && userPointData.hasMostPoints) {
                userWins.find(uw => uw.id === userPointData.userId).wins += 1
            }
        }
    }

    const userPoints = []
    for (const point of points) {
        userPoints.push({
            username: users.find(e => e.id === point.userId).username,
            points: point._sum.points,
            wins: userWins.find(e => e.id === point.userId).wins
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

manageRoute.get('/userpointsperevent', async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await getPlayerPointsPerEvent()
        res.json({
            data: response,
            success: true
        })
    } catch (e) {
        res.json({
            success: false,
            message: "ERROR"
        })
    }
})

manageRoute.post('/missingBetEvents', async (req: Request, res: Response): Promise<void> => {
    const request = req.body

    const missingBetEvents = await getEventsWithMissingBetInstances(request.userId)
    const data = []
    for(const missingBetEvent of missingBetEvents) {
        if(missingBetEvent.Bet.length > 0) {
            data.push({
                eventId: missingBetEvent.id,
                name: missingBetEvent.name,
                count: missingBetEvent.Bet.length,
                firstBetDate: missingBetEvent.Bet.reduce(function(prev, current) {
                    return (prev.date < current.date) ? prev : current
                }).date
            })
        }
    }

    try {
        res.json({
            events: data,
            success: true
        })
    } catch (e: any) {
        res.json({
            success: false,
            message: "ERROR"
        })
    }
})