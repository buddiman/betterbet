import { BetInstance } from "shared/models/betInstance"
import prisma from "../dbConfig";

export async function createBetInstance(betInstance: BetInstance) {
    return prisma.betInstance.create({
        data: betInstance
    });
}

export async function updateBetInstance(betInstance: BetInstance): Promise<BetInstance> {
    return prisma.betInstance.upsert({
        create: betInstance,
        update: betInstance,
        where: {
            userId_betId: {
                userId: betInstance.userId,
                betId: betInstance.betId
            }
        },
    })
}

export function getBetInstance(betId: number, userId: number): Promise<BetInstance> {
    return prisma.betInstance.findUnique({
        where: {
            userId_betId: {
                userId: userId,
                betId: betId
            }
        }
    })
}

export function getBetInstancesByBetId(betId: number): Promise<BetInstance[]> {
    return prisma.betInstance.findMany({
        where: {
            betId: betId
        }
    })
}