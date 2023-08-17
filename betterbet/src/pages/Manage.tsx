import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    ButtonGroup,
    Grid,
    IconButton,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import RedoIcon from '@mui/icons-material/Redo';
import AddEvent from "../components/AddEvent";
import AddLeague from "../components/AddLeague";
import AddBet from "../components/AddBet";
import { Bet } from "shared/models/bet";
import api from "../api";
import Evaluate from "../components/Evaluate";
import { Event } from "shared/models/event";

export default function Manage() {
    const [eventList, setEventList] = React.useState<Event[] | undefined>([])
    const [eventIdValue, setEventIdValue] = React.useState<any>(null)
    const [managedBets, setManagedBets] = React.useState<Bet[] | undefined>(undefined)
    const [openAddEvent, setOpenAddEvent] = React.useState(false)
    const [openAddLeague, setOpenAddLeague] = React.useState(false)
    const [openAddBet, setOpenAddBet] = React.useState(false)
    const [openEvaluate, setOpenEvaluate] = React.useState(false)
    const [unevaluatedBets, setUnevaluatedBets] = React.useState<Bet[]>([])
    const [evaluateType, setEvaluateType] = React.useState('')
    const [evaluateId, setEvaluateId] = React.useState(0)
    const [newPassword, setNewPassword] = useState('');
    const [enteredUserId, setEnteredUserId] = useState('');

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

    const handleClickDeleteBet = async (key: string | undefined) => {
        if (typeof key === "string") {
            const deleteId = parseInt(key)

            try {
                await api.delete(`/bet/${deleteId}`)
                const response = await api.get(`/bets/${eventIdValue}`)
                setManagedBets(response.data.bets)
            } catch (e) {
                console.log(e)
            }
        }
    }

    const handleCloseEvaluate = () => {
        setOpenEvaluate(false);
    }

    const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            const response = await api.post('/auth/resetPassword', {
                id: parseInt(enteredUserId, 10),
                newPassword: newPassword
            })
        } catch (error) {
            console.log(error)
        }
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

    const handleSelectEventChange = async (event: SelectChangeEvent<any>) => {
        if (eventList) {
            const selectedEventId = event.target.value as string;
            const selectedEvent = eventList.find(event => event.id === parseInt(selectedEventId));
            setEventIdValue(selectedEvent?.id || null);
            if (selectedEvent) {
                try {
                    const response = await api.get(`/bets/${selectedEvent.id}`)
                    setManagedBets(response.data.bets)
                } catch (e) {
                    console.log(e)
                }
            }
        }
    }

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
                                        <TableCell align="center"><Button href={e.url || ""}
                                                                          target="_blank">Infos</Button></TableCell>
                                        <TableCell align="center"><Button
                                            data-key={e.id}
                                            data-type={e.type}
                                            onClick={(event) => handleClickOpenEvaluate(event.currentTarget.dataset.key, event.currentTarget.dataset.type)}
                                        >
                                            Evaluate
                                        </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </TableContainer>
                    </Paper>
                </Grid>
                <Grid item xs={6} sm={6} style={gridItemStyle}>
                    <Paper>
                        <Typography variant="h6">
                            Tipp Management
                        </Typography>
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
                        <div style={{height: "450px", overflow: "auto"}}>
                            <TableContainer component={Paper}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">Team 1</TableCell>
                                        <TableCell align="center">Team 2</TableCell>
                                        <TableCell align="center">Typ</TableCell>
                                        <TableCell align="center">Kondition</TableCell>
                                        <TableCell align="center">Frage</TableCell>
                                        <TableCell align="center">Link</TableCell>
                                        <TableCell align="center">Bearbeiten</TableCell>
                                        <TableCell align="center">Neu Auswerten</TableCell>
                                        <TableCell align="center">Löschen</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {managedBets && managedBets.map((e) => (
                                        <TableRow
                                            key={e.id}
                                        >
                                            <TableCell align="center">{e.teamHomeDescription}</TableCell>
                                            <TableCell align="center">{e.teamAwayDescription}</TableCell>
                                            <TableCell align="center">{e.type}</TableCell>
                                            <TableCell align="center">{e.typeCondition}</TableCell>
                                            <TableCell align="center">
                                                {e.question && (
                                                    <Tooltip title={e.question}>
                                                        <IconButton>
                                                            <QuestionMarkIcon/>
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </TableCell>
                                            <TableCell align="center"><Button href={e.url || ""}
                                                                              target="_blank">Infos</Button></TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    disabled={true}
                                                    data-key={e.id}
                                                    data-type={e.type}
                                                    onClick={(event) => handleClickOpenEvaluate(event.currentTarget.dataset.key, event.currentTarget.dataset.type)}
                                                >
                                                    <EditIcon/>
                                                </IconButton>
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    data-key={e.id}
                                                    data-type={e.type}
                                                    onClick={(event) => handleClickOpenEvaluate(event.currentTarget.dataset.key, event.currentTarget.dataset.type)}
                                                >
                                                    <RedoIcon/>
                                                </IconButton>
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    color="error"
                                                    data-key={e.id}
                                                    onClick={(event) => handleClickDeleteBet(event.currentTarget.dataset.key)}
                                                >
                                                    <DeleteIcon/>
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </TableContainer>
                        </div>
                    </Paper>

                </Grid>
                <Grid item xs={6} sm={6} style={gridItemStyle}>
                    <Paper>
                        <Typography variant="h6">
                            Nutzer Passwort ändern (ADMIN)
                        </Typography>
                        <form onSubmit={handleChangePassword}>
                            <TextField
                                label="Nutzer ID"
                                type="number"
                                value={enteredUserId}
                                onChange={(e) => setEnteredUserId(e.target.value)}
                                fullWidth
                                margin="normal"
                                variant="outlined"/>
                            <TextField
                                label="Neues Passwort"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                fullWidth
                                margin="normal"
                                variant="outlined"/>
                            <Button type="submit" variant="contained" color="primary">
                                Passwort ändern
                            </Button>
                        </form>
                    </Paper>
                </Grid>
                <Grid item xs={6} sm={6} style={gridItemStyle}>
                    <Paper>Content 4</Paper>
                </Grid>
            </Grid>


        </Box>
    );
};