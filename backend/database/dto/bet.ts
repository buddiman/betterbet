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