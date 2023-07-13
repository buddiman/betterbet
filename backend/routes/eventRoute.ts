import express, { Request, Response } from 'express';
import { createEvent, getEvent, getEvents, updateEvent } from '../database/dto/event'

export const eventRoute = express.Router()

eventRoute.post('/event', async (req: Request, res: Response): Promise<void> => {
    const event = req.body

    try {
        const newEvent = await createEvent(event)
        res.json({
            success: true,
            message: 'new event with id ' + newEvent.id + ' inserted'
        })
    } catch (e: any) {
        res.json({
            success: false,
            message: "ERROR while insertig a event\n" + event
        })
    }
})

eventRoute.put('/event', async (req: Request, res: Response): Promise<void> => {
    const event = req.body

    try {
        const newEvent = await updateEvent(event)
        res.json({
            success: true,
            message: 'updated event with id ' + newEvent.id
        })
    } catch (e: any) {
        res.json({
            success: false,
            message: "ERROR while updating a event\n" + event
        })
    }
})

eventRoute.get('/event', async (req:Request, res: Response): Promise<void> => {
    const eventId = req.body.eventId

    try {
        const event = await getEvent(eventId)
        res.json({
            event: event
        })
    } catch (e: any) {
        res.json({
            success: false,
            message: "ERROR while fetching a event with id " + eventId
        })
    }
})

eventRoute.get('/events', async (req:Request, res: Response): Promise<void> => {
    try {
        const events = await getEvents()
        res.json({
            event: events
        })
    } catch (e: any) {
        res.json({
            success: false,
            message: "ERROR while fetching all events"
        })
    }
})