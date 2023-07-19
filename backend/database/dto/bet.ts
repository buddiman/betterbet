import { Bet } from "shared/models/bet"
import prisma from "../dbConfig";

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