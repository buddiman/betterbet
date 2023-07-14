import { BetInstance } from "shared/models/betInstance"
import prisma from "../dbConfig";

export async function createBetInstance(betInstance: BetInstance) {
    return prisma.betInstance.create({
        data: betInstance
    });
}

export async function updateBetInstance(betInstance: BetInstance): Promise<BetInstance> {
    return prisma.betInstance.update({
        where: {
            userId_betId: {
                userId: betInstance.userId,
                betId: betInstance.betId
            }
        },
        data: betInstance
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