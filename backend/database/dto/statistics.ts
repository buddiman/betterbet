import prisma from "../dbConfig";


export async function getBetInstancesPointsPerUserId() {
    return prisma.betInstance.groupBy({
        where: {
          points: {
              not: -1
          }
        },
        by: ['userId'],
        _sum: {
            points: true
        },
    })
}

