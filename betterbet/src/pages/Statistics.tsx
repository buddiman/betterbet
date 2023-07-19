import React, { ReactElement, FC, useEffect } from "react";
import { Box, Button, ButtonGroup, Grid, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { Event } from "shared/models/event";
import { Bet } from "shared/models/bet";
import api from "../api";


const Statistics: FC = (): ReactElement => {
    const [eventList, setEventList] = React.useState<Event[] | undefined>([])
    const [eventIdValue, setEventIdValue] = React.useState<any>(null)
    const [displayedBets, setDisplayedBets] = React.useState<Bet[] | undefined>(undefined)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("/events")
                setEventList(response.data.event);
            } catch (error) {
                console.error('Error fetching data from API:', error);
            }
        };
        fetchData();
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/bets/${eventIdValue}`)
                const bets: Bet[] = response.data.bets
                setDisplayedBets(bets.filter(bet => bet.date < new Date()))
            } catch (error) {
                console.error('Error fetching data from API:', error);
            }
        };
        fetchData();
    }, [eventIdValue])

    const handleSelectEventChange = async (event: SelectChangeEvent<any>) => {
        if (eventList) {
            const selectedEventId = event.target.value as string;
            const selectedEvent = eventList.find(event => event.id === parseInt(selectedEventId));
            setEventIdValue(selectedEvent?.id || null);
            if (selectedEvent) {
                try {
                    const response = await api.get(`/bets/${selectedEvent.id}`)
                    //setManagedBets(response.data.bets)
                } catch (e) {
                    console.log(e)
                }
            }
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
            <Grid container spacing={3} justifyContent="center" alignItems="center"
                  style={{width: '100%', height: '100%'}}>
                <Grid item xs={12} sm={12}>
                    <Select
                        labelId="select-label"
                        id="eventSelect"
                        sx={{width: '200px'}}
                        value={eventIdValue || ''}
                        onChange={handleSelectEventChange}
                    >
                        {eventList && eventList.map((event) => (
                            <MenuItem key={event.id} value={event.id}>
                                {event.name}
                            </MenuItem>
                        ))}
                    </Select>
                </Grid>
                <Grid item xs={12} sm={12}>
                    {eventIdValue}
                </Grid>
            </Grid>

        </Box>
    );
};

export default Statistics;