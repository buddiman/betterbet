import { Event } from "../../../shared/models/event"
import prisma from "../dbConfig";

export async function createEvent(event: Event): Promise<Event> {
    return prisma.event.create({
        data: event
    });
}

export async function updateEvent(event: Event): Promise<Event> {
    return prisma.event.update({
        where: {
            id: event.id,
        },
        data: event
    })
}

export function getEvent(eventId: number): Promise<Event> {
    return prisma.event.findUnique({
        where: {
            id: eventId
        }
    })
}