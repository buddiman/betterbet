import React, { useEffect } from "react";
import {
    Box,
    Button,
    ButtonGroup,
    Grid,
    Paper, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography
} from "@mui/material";
import AddEvent from "../components/AddEvent";
import AddLeague from "../components/AddLeague";
import AddBet from "../components/AddBet";
import { Bet } from "shared/models/bet";
import api from "../api";
import Evaluate from "../components/Evaluate";

export default function Manage() {
    const [openAddEvent, setOpenAddEvent] = React.useState(false)
    const [openAddLeague, setOpenAddLeague] = React.useState(false)
    const [openAddBet, setOpenAddBet] = React.useState(false)
    const [openEvaluate, setOpenEvaluate] = React.useState(false)
    const [unevaluatedBets, setUnevaluatedBets] = React.useState<Bet[]>([])
    const [evaluateType, setEvaluateType] = React.useState('')
    const [evaluateId, setEvaluateId] = React.useState(0)

    const handleClickOpenAddEvent = () => {
        setOpenAddEvent(true)
    }

    const handleCloseAddEvent = () => {
        setOpenAddEvent(false);
    }

    const handleClickOpenAddLeague = () => {
        setOpenAddLeague(true)
    }

    const handleCloseAddLeague = () => {
        setOpenAddLeague(false);
    }

    const handleClickOpenAddBet = () => {
        setOpenAddBet(true)
    }

    const handleCloseAddBet = () => {
        setOpenAddBet(false);
    }

    const handleClickOpenEvaluate = (key: string | undefined, type: string | undefined) => {
        if (typeof key === "string" && typeof type === "string") {
            setEvaluateId(parseInt(key))
            setEvaluateType(type)
            setOpenEvaluate(true)
        }
    }

    const handleCloseEvaluate = () => {
        setOpenEvaluate(false);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("/unevaluatedBets")
                setUnevaluatedBets(response.data.bets)
            } catch (error) {
                console.error('Error fetching data from API:', error);
            }
        };
        fetchData();
    }, [openEvaluate])

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
            <AddEvent isOpened={openAddEvent} onClose={handleCloseAddEvent}/>
            <AddLeague isOpened={openAddLeague} onClose={handleCloseAddLeague}/>
            <AddBet isOpened={openAddBet} onClose={handleCloseAddBet}/>
            <Evaluate isOpened={openEvaluate} onClose={handleCloseEvaluate} betId={evaluateId} type={evaluateType}/>
            <Grid container spacing={3} justifyContent="center" alignItems="center"
                  style={{width: '100%', height: '100%'}}>
                <Grid item xs={12} sm={12}>
                    <ButtonGroup>
                        <Button onClick={handleClickOpenAddEvent}>Spieltag hinzufügen</Button>
                        <Button onClick={handleClickOpenAddLeague}>Liga hinzufügen</Button>
                        <Button onClick={handleClickOpenAddBet}>Tipp hinzufügen</Button>
                    </ButtonGroup>
                </Grid>
                <Grid item xs={6} sm={6} style={gridItemStyle}>
                    <Paper>
                        <Typography variant="h6">
                            Auswerten
                        </Typography>
                        <TableContainer component={Paper}>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Team 1</TableCell>
                                    <TableCell align="center">Team 2</TableCell>
                                    <TableCell align="center">Typ</TableCell>
                                    <TableCell align="center">Kondition</TableCell>
                                    <TableCell align="center">Frage</TableCell>
                                    <TableCell align="center">Link</TableCell>
                                    <TableCell align="center">Auswerten</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {unevaluatedBets.map((e) => (
                                    <TableRow
                                        key={e.id}
                                    >
                                        <TableCell align="center">{e.teamHomeDescription}</TableCell>
                                        <TableCell align="center">{e.teamAwayDescription}</TableCell>
                                        <TableCell align="center">{e.type}</TableCell>
                                        <TableCell align="center">{e.typeCondition}</TableCell>
                                        <TableCell align="center">{e.question}</TableCell>
                                        <TableCell align="center"><Button href={e.url || ""} target="_blank">Infos</Button></TableCell>
                                        <TableCell align="center"><Button
                                            data-key={e.id}
                                            data-type={e.type}
                                            onClick={(event) => handleClickOpenEvaluate(event.currentTarget.dataset.key, event.currentTarget.dataset.type)}
                                            >
                                            Test
                                        </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </TableContainer>
                    </Paper>
                </Grid>
                <Grid item xs={6} sm={6} style={gridItemStyle}>
                    <Paper>Content 2</Paper>
                </Grid>
                <Grid item xs={6} sm={6} style={gridItemStyle}>
                    <Paper>Content 3</Paper>
                </Grid>
                <Grid item xs={6} sm={6} style={gridItemStyle}>
                    <Paper>Content 4</Paper>
                </Grid>
            </Grid>


        </Box>
    );
};