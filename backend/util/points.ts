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
    } else if (type === "placement") {
        let resultList = result.split(';').filter(item => item.trim() !== '')
        let userBetList = userBet.split(';').filter(item => item.trim() !== '')
        let points = 0

        for(let i = 0; i < resultList.length; i++) {
            if(resultList[i] === userBetList[i]) {
                console.log(resultList[i] + " is correct same as " +  userBetList[i])
                points += 2
            } else {
                console.log(resultList[i] + " is NOT correct same as " +  userBetList[i])
            }
        }

        return points
    }
    else {
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