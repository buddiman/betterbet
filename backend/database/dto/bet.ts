import { Bet } from "shared/models/bet"
import prisma from "../dbConfig";

interface UserPoints {
    userId: number;
    points: number;
    hasMostPoints: boolean;
}

export async function createBet(bet: Bet): Promise<Bet> {
    return prisma.bet.create({
        data: bet
    });
}

export async function updateBet(bet: Bet): Promise<Bet> {
    return prisma.bet.update({
        where: {
            id: bet.id,
        },
        data: bet
    })
}

export async function deleteBet(id: number): Promise<Bet> {
    return prisma.bet.delete({
        where: {
            id: id,
        },
    })
}

export function getBet(betId: number): Promise<Bet> {
    return prisma.bet.findUnique({
        where: {
            id: betId
        }
    })
}

export function getBetsForEvent(eventId: number): Promise<Bet[]> {
    return prisma.bet.findMany({
        where: {
            eventId: eventId
        },
        orderBy: {
            date: 'asc'
        }
    })
}

export function getBetsForEventWithBetInstances(eventId: number) {
    return prisma.bet.findMany({
        include: {
            BetInstance: true,
        },
        where: {
            eventId: eventId
        },
        orderBy: {
            date: "asc"
        }
    })
}

export function getMissingBetsForEvent(eventId: number, userId: number): Promise<Bet[]> {
    return prisma.bet.findMany({
        where: {
            BetInstance: {
                none: {
                    userId: userId
                }
            },
            date: {
                gt: new Date()
            },
            eventId: eventId
        },
        orderBy: {
            date: 'asc'
        },
    })
}

export function getNotEvaluatedBetsInThePast(): Promise<Bet[]> {
    return prisma.bet.findMany({
        where: {
            result: null,
            date: {
                lt: new Date()
            }
        }
    })
}

export async function getPlayerPointsPerEvent() {
    const users = await prisma.user.findMany();
    const events = await prisma.event.findMany();

    const userEventPoints = [];

    for (const event of events) {
        const betInstances = await prisma.betInstance.findMany({
            where: {
                bet: { eventId: event.id },
                points: {
                    not: -1 // Ignore instances with points = -1
                }
            },
            include: { user: true },
        });

        const pointsPerUser: Record<number, UserPoints> = {};

        // Initialize pointsPerUser with 0 points for all users
        for (const user of users) {
            pointsPerUser[user.id] = {
                userId: user.id,
                points: 0,
                hasMostPoints: false,
            };
        }

        for (const betInstance of betInstances) {
            const user = betInstance.user;
            const points = betInstance.points || 0;

            pointsPerUser[user.id].points += points;
        }

        userEventPoints.push({
            eventId: event.id,
            eventName: event.name,
            pointsPerUser: Object.values(pointsPerUser),
        });
    }

    return userEventPoints.map(eventData => {
        const highestPoints = Math.max(...eventData.pointsPerUser.map(user => user.points));

        eventData.pointsPerUser.forEach(user => {
            user.hasMostPoints = user.points === highestPoints;
        });

        return eventData;
    });
}