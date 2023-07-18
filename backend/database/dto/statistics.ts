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

export async function getEventsWithMissingBetInstances(userId: number) {
    const eventsWithMissingBets = await prisma.event.findMany({
        select: {
            Bet: {
                where: {
                    BetInstance: {
                        none: {
                            userId: userId
                        }
                    }
                }
            },
            id: true,
            name: true
        },
    })

    return eventsWithMissingBets
}