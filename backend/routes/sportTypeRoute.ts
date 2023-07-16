import express, { Request, Response } from 'express';
import { getSportTypes } from "../database/dto/sportType";

export const sportTypeRoute = express.Router()

sportTypeRoute.get('/sporttypes', async (req:Request, res: Response): Promise<void> => {
    try {
        const sportTypes = await getSportTypes()
        res.json({
            sportTypes: sportTypes
        })
    } catch (e: any) {
        res.json({
            success: false,
            message: "ERROR while fetching all sportTypes"
        })
    }
})