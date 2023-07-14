import { League } from "shared/models/league"
import prisma from "../dbConfig";

export async function createLeague(league: League): Promise<League> {
    return prisma.league.create({
        data: league
    });
}

export async function updateLeague(league: League): Promise<League> {
    return prisma.league.update({
        where: {
            id: league.id,
        },
        data: league
    })
}

export function findLeague(name: string, sporttype: number, countrycode: string): Promise<League> {
    return prisma.league.findFirst({
        where: {
            name: name,
            sportTypeId: sporttype,
            countryCode: countrycode
        }
    })
}

export function getLeague(leagueId: number): Promise<League> {
    return prisma.league.findUnique({
        where: {
            id: leagueId
        }
    })
}

export function getAllLeagues(): Promise<League[]> {
    return prisma.league.findMany()
}