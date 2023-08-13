import React, { ReactElement, FC, useEffect, useState } from "react";
import { Box, Select, MenuItem, Stack, SelectChangeEvent, InputLabel } from "@mui/material";
import BetWidget from '../components/BetWidget'
import { Event } from "shared/models/event"
import api from "../api"
import * as AuthService from "../services/auth.service";

interface MissingBetEvent {
    eventId: number
    name: string
    count: number
}
const Bets: FC<any> = (): ReactElement => {
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<number>(1);
    const [missingBetEvents, setMissingBetEvents] = useState<MissingBetEvent[] | undefined>(undefined)

    const handleSelectedEventChange = (event: SelectChangeEvent<any>) => {
        const eventId = event.target.value as number;
        setSelectedEvent(eventId);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = AuthService.getCurrentUser()
                const response = await api.get("/events");
                setEvents(response.data.event);
                const eventsWithMissingBets = await api.post("/missingBetEvents", {
                    userId: user.id
                })
                setMissingBetEvents(eventsWithMissingBets.data.events)
            } catch (error) {
                console.error('Error fetching data from API:', error);
            }
        };
        fetchData();
    }, []);

    function getMissingNumberString(id: number): string {
        const missingNumberEvent = missingBetEvents?.find(e => e.eventId === id)
        if(missingNumberEvent) {
            return " (" + missingNumberEvent.count + " offen)"
        } else {
            return ""
        }
    }

    return (
        <Box sx={{
            flexGrow: 1,
            backgroundColor: 'whitesmoke',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Stack spacing={2}>
                <InputLabel id="eventSelectorLabel">Spieltag wählen</InputLabel>
                <Select
                    labelId="eventSelectorLabel"
                    value={selectedEvent}
                    onChange={handleSelectedEventChange}
                    color="success"
                >
                    {events.map((e) => (
                        <MenuItem key={e.id} value={e.id}>
                            {e.name}{getMissingNumberString(e.id)}
                        </MenuItem>
                    ))}
                </Select>
                <BetWidget eventId={selectedEvent}/>
            </Stack>
        </Box>
    );
};

export default Bets;