import { SportType } from "../../../shared/models/sportType"
import prisma from "../dbConfig";

export async function createSportType(sportType: SportType): Promise<SportType> {
    return prisma.sportType.create({
        data: sportType
    });
}

export async function updateSportType(sportType: SportType): Promise<SportType> {
    return prisma.sportType.update({
        where: {
            id: sportType.id,
        },
        data: sportType
    })
}

export function getSportType(sportTypeId: number): Promise<SportType> {
    return prisma.sportType.findUnique({
        where: {
            id: sportTypeId
        }
    })
}