import React, { ReactElement, FC, useEffect, useState } from "react";
import { Box, Select, MenuItem, Stack, SelectChangeEvent, InputLabel } from "@mui/material";
import BetWidget from '../components/BetWidget'
import { Event } from "shared/models/event"
import api from "../api"

const Bets: FC<any> = (): ReactElement => {
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<number>(1); // Initialize with an empty string

    const handleSelectedEventChange = (event: SelectChangeEvent<any>) => {
        const eventId = event.target.value as number;
        setSelectedEvent(eventId);
        console.log("Set event ID to " + eventId);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("/events");
                setEvents(response.data.event);
            } catch (error) {
                console.error('Error fetching data from API:', error);
            }
        };
        fetchData();
    }, []);

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
                            {e.name}
                        </MenuItem>
                    ))}
                </Select>
                <BetWidget eventId={selectedEvent}/>
            </Stack>
        </Box>
    );
};

export default Bets;