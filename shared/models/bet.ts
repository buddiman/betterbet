export interface Bet{
    id: number
    type: string
    typeCondition: string | null          // e.g. +/- 4,5 Tore
    teamHomeDescription: string
    teamHomeUrl: string | null
    teamAwayDescription: string
    teamAwayUrl:string | null
    leagueId: number // leagueId
    sportTypeId: number
    question: string | null
    date: Date
    result: string | null
    url: string | null
    eventId: number
}