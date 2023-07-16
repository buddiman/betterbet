import React, { ReactElement, FC, useEffect, useState } from "react";
import { Box, Button, ButtonGroup, Stack } from "@mui/material";
import BetWidget from '../components/BetWidget'
import {Event} from "shared/models/event"
import api from "../api"

const Bets: FC<any> = (): ReactElement => {
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<number>(1)

    const handleSelectedEventChange = (key: string | undefined) => {
        console.log(key)
        let eventId: number = 0
        if (typeof key === "string") {
            console.log(key)
            eventId = parseInt(key)
        }
        setSelectedEvent(eventId);
        console.log("Set event ID to " + eventId)
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("/events")
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
                <ButtonGroup variant="contained" aria-label="outlined primary button group">
                    {events.map((e) => (
                        <Button
                            data-key={e.id}
                            color="success"
                            onClick={(event) => handleSelectedEventChange(event.currentTarget.dataset.key)}
                        >
                            {e.name}
                        </Button>
                    ))}
                </ButtonGroup>
                <BetWidget eventId={selectedEvent}/>
            </Stack>
        </Box>
    );
};

export default Bets;