interface ResultBetParsed {
    homeResult: number
    awayResult: number
}

export function calculatePointsForBet(result: string, type: string, userBet: string): number {
    if(type === "result") {
        const splittedResult = splitResult(result)
        const splittedUserBet = splitResult(userBet)

        // correct = 3
        if(splittedResult.homeResult === splittedUserBet.homeResult && splittedResult.awayResult === splittedUserBet.awayResult) {
            return 3
        }
        // torDiff = 2
        if(splittedResult.homeResult - splittedResult.awayResult === splittedUserBet.homeResult - splittedUserBet.awayResult) {
            return 2
        }

        // tendenz = 1
        if(splittedResult.homeResult > splittedResult.awayResult && splittedUserBet.homeResult > splittedUserBet.awayResult) {
            return 1
        }

        if(splittedResult.homeResult < splittedResult.awayResult && splittedUserBet.homeResult < splittedUserBet.awayResult) {
            return 1
        }
        // falsch = 0
        return 0
    } else {
        if(userBet === result) {
            return 2
        }
    }
    return 0
}

function splitResult(result:string): ResultBetParsed {
    const splittedResult = result.split(':')
    return {
        homeResult: parseInt(splittedResult[0]),
        awayResult: parseInt(splittedResult[1])
    }
}