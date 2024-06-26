import React, { FC, ReactElement, useEffect, useState } from "react";
import { Box, Grid, Paper, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import RemoveIcon from '@mui/icons-material/Remove';
import api from "../api";
import * as AuthService from "../services/auth.service";

interface UserPoints {
    username: string
    points: number
    wins: number
}

interface MissingBetEvent {
    eventId: number
    name: string
    count: number
    firstBetDate: string
}

const Home: FC<any> = (): ReactElement => {
    const [userPoints, setUserPoints] = useState<UserPoints[] | undefined>(undefined)
    const [missingBetEvents, setMissingBetEvents] = useState<MissingBetEvent[] | undefined>(undefined)

    const eventWinnerIcons = (count: number) => {
        const icons = [];
        if(count === 0) {
            icons.push(<RemoveIcon color="error" />)
        } else {
            let lessThanFive = count % 5;
            let fiveTimesWins = (count / 5) | 0
            for (let i = 0; i < fiveTimesWins; i++) {
                icons.push(<MilitaryTechIcon color="warning" fontSize="medium"/>);
            }
            for (let i = 0; i < lessThanFive; i++) {
                icons.push(<MilitaryTechIcon color="success" fontSize="small"/>);
            }
        }

        return icons;
    };

    useEffect(() => {
        const fetchMissingBets = async () => {
            const user = AuthService.getCurrentUser()
            if (!user) {
                return
            }
            const eventsWithMissingBets = await api.post("/missingBetEvents", {
                userId: user.id
            })
            setMissingBetEvents(eventsWithMissingBets.data.events)

        }
        const fetchData = async () => {
            try {
                const response = await api.get("/userpoints")
                setUserPoints(response.data.points)

            } catch (error) {
                console.error('Error fetching data from API:', error);
            }
        };
        fetchData();
        fetchMissingBets()
    }, [])

    const gridItemStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    };

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
                <Grid item xs={12} sm={12}/>
                <Grid item xs={6} sm={6} style={gridItemStyle}>
                    <Paper>
                        <Typography variant="h6" align="center">
                            Punktetabelle
                        </Typography>
                        <TableContainer component={Paper}>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">User</TableCell>
                                    <TableCell align="center">Punkte</TableCell>
                                    <TableCell align="center">Spieltagssiege</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {userPoints && userPoints.map((e) => (
                                    <TableRow>
                                        <TableCell align="center">{e.username}</TableCell>
                                        <TableCell align="center">{e.points}</TableCell>
                                        <TableCell align="center">{eventWinnerIcons(e.wins)}</TableCell>
                                    </TableRow>
                                ))
                                }
                            </TableBody>
                        </TableContainer>
                    </Paper>
                </Grid>
                <Grid item xs={6} sm={6} style={gridItemStyle}>
                    <Paper>
                        <Typography variant="h6" align="center">
                            Offene Tipps
                        </Typography>
                        <TableContainer component={Paper}>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Spieltag</TableCell>
                                    <TableCell align="center">Anzahl</TableCell>
                                    <TableCell align="center">Bis wann?</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {missingBetEvents && missingBetEvents.map((e) => (
                                    <TableRow>
                                        <TableCell align="center">{e.name}</TableCell>
                                        <TableCell align="center">{e.count}</TableCell>
                                        <TableCell align="center">{new Date(e.firstBetDate).toLocaleString('de-DE')}</TableCell>
                                    </TableRow>
                                ))
                                }
                            </TableBody>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Home;