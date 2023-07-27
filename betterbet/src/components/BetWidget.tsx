import React, { FC, ReactElement, useEffect, useState } from "react";
import {
    Grid,
    Button,
    Avatar,
    Typography,
    Link,
    TextField,
    Stack,
    Fab,
    Box,
    Paper,
    Switch,
    FormControl, FormLabel, FormControlLabel, FormGroup
} from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Bet } from "shared/models/bet";
import IUser from "../types/user.type";
import * as AuthService from "../services/auth.service";
import { BetInstance } from "shared/models/betInstance";
import api from "../api"
import { SportType } from "shared/models/sportType";
import { League } from "shared/models/league";
import ReactCountryFlag from "react-country-flag"

interface BetWidgetProps {
    eventId: number | undefined
}

const betTypes = [
    {key: "1X2", sentence: "Wie ist die Tendenz zu Spielende (Ohne Verlängerung)?"},
    {key: "winner", sentence: "Wer gewinnt das Spiel?"},
    {key: "result", sentence: "Wie ist das Spielergebnis zu Spielende (Ohne Verlängerung)?"},
    {key: "overunder", sentence: "Über oder unter "},
    {key: "question", sentence: ""},
    {key: "1or2", sentence: "Wer "},
]

const dummyBet: Bet = {
    date: new Date(),
    eventId: 0,
    id: 0,
    leagueId: 0,
    question: null,
    result: null,
    teamAwayDescription: "DUMMY",
    teamAwayUrl: null,
    teamHomeDescription: "DUMMY",
    teamHomeUrl: null,
    type: "1X2",
    typeCondition: null,
    url: null
}

const BetWidget: FC<BetWidgetProps> = ({eventId}): ReactElement => {
    const [selectedButton, setSelectedButton] = useState('');
    const [currentUser, setCurrentUser] = useState<IUser | undefined>(undefined);
    const [betType, setBetType] = useState('1X2')
    const [bets, setBets] = useState<Bet[]>([]);
    const [bet, setBet] = useState<Bet>(dummyBet)
    const [betIndex, setBetIndex] = useState<number>(0)
    const [betInstance, setBetInstance] = useState<BetInstance | undefined>(undefined)
    const [sportTypes, setSportTypes] = useState<SportType[] | undefined>(undefined)
    const [sportTypeName, setSportTypeName] = useState<string | undefined>('')
    const [league, setLeague] = useState<League | undefined>(undefined)
    const [homeResult, setHomeResult] = useState('-')
    const [awayResult, setAwayResult] = useState('-')
    const [isLocked, setIsLocked] = useState(false)
    const [showMissing, setShowMissing] = useState(false);

    const isMobile = window.matchMedia('(max-width: 767px)').matches

    const handleBetButton = (key: string | undefined) => {
        if (typeof key === "string") {
            console.log(key)
            setSelectedButton(key)
        }
    };

    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShowMissing(event.target.checked);
    };

    const borderColor = () => {
        if (betInstance) {
            if (betInstance.points < 0) {
                return 'grey';
            } else if (betInstance.points === 0) {
                return 'red';
            } else if (betInstance.points === 1) {
                return 'yellow';
            } else if (betInstance.points === 2) {
                return 'green';
            } else if (betInstance.points === 3) {
                return 'purple';
            }
        } else {
            return 'grey'
        }
    }

    useEffect(() => {
        if (!isLocked) {
            const updateBetInstance = async () => {
                const response = await api.put('/betInstance', {
                    betId: bet.id,
                    userId: currentUser?.id,
                    userBet: homeResult + ':' + awayResult,
                    points: -1
                })
            }
            if (!(homeResult === '-' || awayResult === '-')) {
                updateBetInstance()
            }
        }
    }, [homeResult, awayResult])

    useEffect(() => {
        const user = AuthService.getCurrentUser()
        setCurrentUser(user)

    }, [])


    useEffect(() => {
        console.log("selected button: " + selectedButton)
        if (!isLocked && selectedButton !== '') {
            const updateBetInstance = async () => {
                const response = await api.put('/betInstance', {
                    betId: bet.id,
                    userId: currentUser?.id,
                    userBet: selectedButton,
                    points: -1
                })
            }
            if (bet.type !== 'result') {
                updateBetInstance()
            }
        }
    }, [selectedButton])

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (showMissing) {
                    const result = await api.get(`/missingBets/${eventId}/${currentUser?.id}`)
                    setBets(result.data.bets)
                } else {
                    const response = await api.get(`/bets/${eventId}`)
                    if (response.data.bets.length === 0) {
                        setBets([dummyBet])
                        console.log("EMPTY")
                    } else {
                        setBets(response.data.bets)
                    }
                }
            } catch (e) {
                console.log(e)
            }
        }
        fetchData()
        setBetIndex(0)
    }, [showMissing])

    useEffect(() => {
        setBet({...bets[0]})
        setBetIndex(0)
    }, [bets])

    useEffect(() => {
        if (bets.length > 0) {
            setBet(bets[betIndex]);
            setBetType(bets[betIndex].type);
        }
    }, [bets, betIndex]);

    useEffect(() => {
        const fetchData = async () => {
            if (bet.id) {
                const now = new Date().getTime()
                if (now >= new Date(bet.date).getTime()) {
                    setIsLocked(true)
                } else {
                    setIsLocked(false)
                }

                const leagueResponse = await api.get(`/league/${bet.leagueId}`)
                setLeague(leagueResponse.data.league)

                if (leagueResponse.data.league && sportTypes) {
                    const type = sportTypes.find(e => e.id === leagueResponse.data.league.sportTypeId)
                    if (type) {
                        setSportTypeName(type.name)
                    }
                }

                const response = await api.get(`/betInstance/${currentUser?.id}/${bet.id}`)
                const responseData = response.data.betInstance
                setBetInstance(response.data.betInstance)
                if (responseData) {
                    const betInstance = responseData.userBet
                    if (bet.type === 'result' && betInstance) {
                        const result = betInstance.split(':')
                        console.log(result)
                        setHomeResult(result[0])
                        setAwayResult(result[1])
                    }
                    if (bet.type !== 'result' && betInstance) {
                        console.log("BUTTON FOUND")
                        setSelectedButton(betInstance)
                    }
                } else if (bet.type !== 'result') {
                    setSelectedButton('')
                } else if (bet.type === 'result') {
                    setHomeResult('-')
                    setAwayResult('-')
                }
            }
        };
        fetchData()
    }, [bet])

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (showMissing) {
                    const result = await api.get(`/missingBets/${eventId}/${currentUser?.id}`)
                    setBets(result.data.bets)
                } else {
                    const response = await api.get(`/bets/${eventId}`)
                    if (response.data.bets.length === 0) {
                        setBets([dummyBet])
                        console.log("EMPTY")
                    } else {
                        setBets(response.data.bets)
                    }
                }
                const responseSportTypes = await api.get('/sporttypes')
                setSportTypes(responseSportTypes.data.sportTypes)
                if (bet.id) {
                    const responseBetInstance = await api.get(`/betInstance/${currentUser?.id}/${bet.id}`)
                    const betInstance = responseBetInstance.data
                    console.log(betInstance)
                }
            } catch (error) {
                console.error('Error fetching data from API:', error);
            }
        };
        fetchData();
    }, [eventId]);

    const handleNextBet = () => {
        console.log("NEXT")
        setBetIndex((prevIndex) => {
            const newIndex = prevIndex + 1;
            return newIndex < bets.length ? newIndex : prevIndex;
        });
        setSelectedButton('')
    };

    const handlePreviousBet = () => {
        console.log("PREVIOUS")
        setBetIndex((prevIndex) => {
            const newIndex = prevIndex - 1;
            return newIndex >= 0 ? newIndex : prevIndex;
        });
        setSelectedButton('')
    };

    const gridItemStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 1,
    };

    const gridItemStyleMobile = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 1,
    };


    return (
        <div>
            {
                isMobile ? (
                    <Box
                        sx={{
                            width: 350,
                            height: 800,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundImage: 'url(assets/bg-soccer-large.jpg)',
                            backgroundSize: '100% 100%',
                            backgroundColor: 'primary.dark',
                            border: `6px solid ${borderColor()}`,
                            borderRadius: '4px',
                        }}
                    >
                        <Grid container spacing={0} justifyContent="center" alignItems="center"
                              style={{width: '100%', height: 'auto'}}>
                            <Grid item xs={4} style={{...gridItemStyle, height: 150}}>
                                <Paper variant="outlined">
                                    {bet.teamHomeUrl && (
                                        <Avatar
                                            alt="Away Team"
                                            src={bet.teamHomeUrl}
                                            sx={{width: 100, height: 100}}
                                            variant="square"
                                        />
                                    )}
                                </Paper>
                            </Grid>
                            <Grid item xs={4} style={gridItemStyle}>
                                <Typography variant="h3" gutterBottom>
                                    {bet.result || "-:-"}
                                </Typography>
                            </Grid>
                            <Grid item xs={4} style={gridItemStyle}>
                                <Paper variant="outlined">
                                    {bet.teamAwayUrl && (
                                        <Avatar
                                            alt="Away Team"
                                            src={bet.teamAwayUrl}
                                            sx={{width: 100, height: 100}}
                                            variant="square"
                                        />
                                    )}
                                </Paper>
                            </Grid>
                            <Grid item xs={4} style={{...gridItemStyle, height: 100}}>
                                <Paper variant="outlined">
                                    <Typography variant="body2" gutterBottom>
                                        {bet.teamHomeDescription}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={4} style={gridItemStyle}/>
                            <Grid item xs={4} style={gridItemStyle}>
                                <Paper variant="outlined">
                                    <Typography variant="body2" gutterBottom>
                                        {bet.teamAwayDescription}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={1}/>
                            <Grid item xs={10} style={{...gridItemStyle, height: 120}}>
                                <Paper variant="outlined">
                                    <Typography variant="caption" style={{wordWrap: 'break-word', overflowWrap: 'break-word'}}>
                                        {betTypes.find((e) => e.key === bet.type)?.sentence ?? ""}{bet.typeCondition}{bet.question}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={1}/>
                            <Grid item xs={1} style={{...gridItemStyle, height: 100}}/>
                            {betType === '1X2' && (
                                <Grid item xs={10} style={gridItemStyle}>
                                    <Button
                                        data-key="1"
                                        variant={selectedButton === "1" ? "contained" : "outlined"}
                                        color={selectedButton === "1" ? "primary" : "error"}
                                        disabled={isLocked === true}
                                        onClick={(event) => handleBetButton(event.currentTarget.dataset.key)}
                                    >
                                        1
                                    </Button>
                                    <Button
                                        data-key="X"
                                        variant={selectedButton === "X" ? "contained" : "outlined"}
                                        color={selectedButton === "X" ? "primary" : "error"}
                                        disabled={isLocked === true}
                                        onClick={(event) => handleBetButton(event.currentTarget.dataset.key)}
                                    >
                                        X
                                    </Button>
                                    <Button
                                        data-key="2"
                                        variant={selectedButton === "2" ? "contained" : "outlined"}
                                        color={selectedButton === "2" ? "primary" : "error"}
                                        disabled={isLocked === true}
                                        onClick={(event) => handleBetButton(event.currentTarget.dataset.key)}
                                    >
                                        2
                                    </Button>
                                </Grid>
                            )}
                            {betType === 'winner' && (
                                <Grid item xs={10} style={gridItemStyle}>
                                    <Button
                                        data-key="1"
                                        variant={selectedButton === "1" ? "contained" : "outlined"}
                                        color={selectedButton === "1" ? "primary" : "error"}
                                        disabled={isLocked === true}
                                        onClick={(event) => handleBetButton(event.currentTarget.dataset.key)}
                                    >
                                        1
                                    </Button>
                                    <Button
                                        data-key="2"
                                        variant={selectedButton === "2" ? "contained" : "outlined"}
                                        color={selectedButton === "2" ? "primary" : "error"}
                                        disabled={isLocked === true}
                                        onClick={(event) => handleBetButton(event.currentTarget.dataset.key)}
                                    >
                                        2
                                    </Button>
                                </Grid>
                            )}
                            {betType === 'overunder' && (
                                <Grid item xs={10} style={gridItemStyle}>
                                    <Button
                                        data-key="Über"
                                        variant={selectedButton === "Über" ? "contained" : "outlined"}
                                        color={selectedButton === "Über" ? "primary" : "error"}
                                        disabled={isLocked === true}
                                        onClick={(event) => handleBetButton(event.currentTarget.dataset.key)}
                                    >
                                        Über
                                    </Button>
                                    <Button
                                        data-key="Unter"
                                        variant={selectedButton === "Unter" ? "contained" : "outlined"}
                                        color={selectedButton === "Unter" ? "primary" : "error"}
                                        disabled={isLocked === true}
                                        onClick={(event) => handleBetButton(event.currentTarget.dataset.key)}
                                    >
                                        Unter
                                    </Button>
                                </Grid>
                            )}
                            {betType === 'question' && (
                                <Grid item xs={10} style={gridItemStyle}>
                                    <Button
                                        data-key="Ja"
                                        variant={selectedButton === "Ja" ? "contained" : "outlined"}
                                        color={selectedButton === "Ja" ? "primary" : "error"}
                                        disabled={isLocked === true}
                                        onClick={(event) => handleBetButton(event.currentTarget.dataset.key)}
                                    >
                                        Ja
                                    </Button>
                                    <Button
                                        data-key="Nein"
                                        variant={selectedButton === "Nein" ? "contained" : "outlined"}
                                        color={selectedButton === "Nein" ? "primary" : "error"}
                                        disabled={isLocked === true}
                                        onClick={(event) => handleBetButton(event.currentTarget.dataset.key)}
                                    >
                                        Nein
                                    </Button>
                                </Grid>
                            )}
                            {betType === '1or2' && (
                                <Grid item xs={10} style={gridItemStyle}>
                                    <Button
                                        data-key="1"
                                        variant={selectedButton === "1" ? "contained" : "outlined"}
                                        color={selectedButton === "1" ? "primary" : "error"}
                                        disabled={isLocked === true}
                                        onClick={(event) => handleBetButton(event.currentTarget.dataset.key)}
                                    >
                                        1
                                    </Button>
                                    <Button
                                        data-key="2"
                                        variant={selectedButton === "2" ? "contained" : "outlined"}
                                        color={selectedButton === "2" ? "primary" : "error"}
                                        disabled={isLocked === true}
                                        onClick={(event) => handleBetButton(event.currentTarget.dataset.key)}
                                    >
                                        2
                                    </Button>
                                </Grid>
                            )}
                            {betType === 'result' && (
                                <Grid item xs={10} style={gridItemStyle}>
                                    <TextField
                                        value={homeResult}
                                        onChange={(e) => setHomeResult(e.target.value)}
                                        autoFocus
                                        type="number"
                                        margin="dense"
                                        id="textFieldHomeResult"
                                        label="Heimteam"
                                        fullWidth
                                        variant="standard"
                                        disabled={isLocked === true}
                                    />
                                    :
                                    <TextField
                                        value={awayResult}
                                        onChange={(e) => setAwayResult(e.target.value)}
                                        autoFocus
                                        type="number"
                                        margin="dense"
                                        id="textFieldAwayResult"
                                        label="Auswärtsteam"
                                        fullWidth
                                        variant="standard"
                                        disabled={isLocked === true}
                                    />
                                </Grid>
                            )}
                            <Grid item xs={1}/>
                            <Grid item xs={2}>
                                <Fab color='primary' aria-label='previous-bet' onClick={handlePreviousBet}>
                                    <ArrowBackIosIcon/>
                                </Fab>
                            </Grid>
                            <Grid item xs={8} style={gridItemStyle}>
                                <Paper variant="outlined">
                                    <Stack spacing={1}>
                                        {league && (
                                            <Typography variant="body2" gutterBottom>
                                                <ReactCountryFlag
                                                    countryCode={league.countryCode}
                                                    className="emojiFlag" style={{
                                                    fontSize: '2em',
                                                    lineHeight: '2em',
                                                }}
                                                /> - {sportTypeName} - {league.name}
                                            </Typography>

                                        )}
                                        {bet.url && (
                                            <Button variant='outlined' href={bet.url} target="_blank">
                                                <OpenInNewIcon/> Infos
                                            </Button>

                                        )}
                                        <Typography variant="body1" gutterBottom style={{textAlign: "center"}}>
                                            {bet.date && (
                                                new Date(bet.date).toLocaleString('de-DE'))}
                                        </Typography>
                                    </Stack>
                                </Paper>
                            </Grid>
                            <Grid item xs={2}>
                                <Fab color='primary' aria-label='next-bet' onClick={handleNextBet}>
                                    <ArrowForwardIosIcon/>
                                </Fab>
                            </Grid>
                        </Grid>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            width: 950,
                            height: 543,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundImage: 'url(assets/bg-soccer-large.jpg)',
                            backgroundSize: '100% 100%',
                            backgroundColor: 'primary.dark',
                            border: `6px solid ${borderColor()}`,
                            borderRadius: '4px',
                        }}
                    >

                        <Grid container spacing={0} justifyContent="center" alignItems="center"
                              style={{width: '100%', height: '100%'}}>
                            <Grid item xs={1}>
                                <FormControl component="fieldset">
                                    <FormGroup aria-label="position" row>
                                        <FormControlLabel
                                            value="bottom"
                                            control={<Switch color="primary" checked={showMissing}
                                                             onChange={handleSwitchChange}/>}
                                            label={
                                                <span style={{display: 'block', textAlign: 'center'}}>
                                        Nur fehlende anzeigen
                                    </span>
                                            }
                                            labelPlacement="bottom"
                                        />
                                    </FormGroup>
                                </FormControl>
                            </Grid>
                            <Grid item xs={3} style={gridItemStyle}>
                                <Paper variant="outlined">
                                    {bet.teamHomeUrl && (
                                        <Avatar
                                            alt="Home Team"
                                            src={bet.teamHomeUrl}
                                            sx={{width: 120, height: 120}}
                                            variant="square"
                                        />
                                    )}
                                </Paper>
                            </Grid>
                            <Grid item xs={4} style={gridItemStyle}>
                                <Typography variant="h2" gutterBottom>
                                    {bet.result || "-:-"}
                                </Typography>
                            </Grid>
                            <Grid item xs={3} style={gridItemStyle}>
                                <Paper variant="outlined">
                                    {bet.teamAwayUrl && (
                                        <Avatar
                                            alt="Away Team"
                                            src={bet.teamAwayUrl}
                                            sx={{width: 120, height: 120}}
                                            variant="square"
                                        />
                                    )}
                                </Paper>
                            </Grid>
                            <Grid item xs={1}>
                            </Grid>

                            {/*row end*/}
                            <Grid item xs={1}>
                                <Fab color='primary' aria-label='previous-bet' onClick={handlePreviousBet}>
                                    <ArrowBackIosIcon/>
                                </Fab>
                            </Grid>
                            <Grid item xs={3} style={gridItemStyle}>
                                <Paper variant="outlined">
                                    <Typography variant="h5" gutterBottom>
                                        {bet.teamHomeDescription}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={4} style={gridItemStyle}>
                                <Paper variant="outlined">
                                    <Stack spacing={1}>
                                        {league && (
                                            <Typography variant="body2" gutterBottom>
                                                <ReactCountryFlag
                                                    countryCode={league.countryCode}
                                                    className="emojiFlag" style={{
                                                    fontSize: '2em',
                                                    lineHeight: '2em',
                                                }}
                                                /> - {sportTypeName} - {league.name}
                                            </Typography>

                                        )}
                                        {bet.url && (
                                            <Button variant='outlined' href={bet.url} target="_blank">
                                                <OpenInNewIcon/> Infos
                                            </Button>

                                        )}
                                        <Typography variant="h6" gutterBottom style={{textAlign: "center"}}>
                                            {bet.date && (
                                                new Date(bet.date).toLocaleString('de-DE'))}
                                        </Typography>
                                    </Stack>
                                </Paper>
                            </Grid>
                            <Grid item xs={3} style={gridItemStyle}>
                                <Paper variant="outlined">
                                    <Typography variant="h5" gutterBottom>
                                        {bet.teamAwayDescription}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={1}>
                                <Fab color='primary' aria-label='previous-bet' onClick={handleNextBet}>
                                    <ArrowForwardIosIcon/>
                                </Fab>
                            </Grid>

                            {/* row end
                    start bet controls*/}
                            <Grid item xs={1}/>
                            {betType === '1X2' && (
                                <Grid item xs={10} style={gridItemStyle}>
                                    <Button
                                        data-key="1"
                                        variant={selectedButton === "1" ? "contained" : "outlined"}
                                        color={selectedButton === "1" ? "primary" : "error"}
                                        disabled={isLocked === true}
                                        onClick={(event) => handleBetButton(event.currentTarget.dataset.key)}
                                    >
                                        1
                                    </Button>
                                    <Button
                                        data-key="X"
                                        variant={selectedButton === "X" ? "contained" : "outlined"}
                                        color={selectedButton === "X" ? "primary" : "error"}
                                        disabled={isLocked === true}
                                        onClick={(event) => handleBetButton(event.currentTarget.dataset.key)}
                                    >
                                        X
                                    </Button>
                                    <Button
                                        data-key="2"
                                        variant={selectedButton === "2" ? "contained" : "outlined"}
                                        color={selectedButton === "2" ? "primary" : "error"}
                                        disabled={isLocked === true}
                                        onClick={(event) => handleBetButton(event.currentTarget.dataset.key)}
                                    >
                                        2
                                    </Button>
                                </Grid>
                            )}
                            {betType === 'winner' && (
                                <Grid item xs={10} style={gridItemStyle}>
                                    <Button
                                        data-key="1"
                                        variant={selectedButton === "1" ? "contained" : "outlined"}
                                        color={selectedButton === "1" ? "primary" : "error"}
                                        disabled={isLocked === true}
                                        onClick={(event) => handleBetButton(event.currentTarget.dataset.key)}
                                    >
                                        1
                                    </Button>
                                    <Button
                                        data-key="2"
                                        variant={selectedButton === "2" ? "contained" : "outlined"}
                                        color={selectedButton === "2" ? "primary" : "error"}
                                        disabled={isLocked === true}
                                        onClick={(event) => handleBetButton(event.currentTarget.dataset.key)}
                                    >
                                        2
                                    </Button>
                                </Grid>
                            )}
                            {betType === 'overunder' && (
                                <Grid item xs={10} style={gridItemStyle}>
                                    <Button
                                        data-key="Über"
                                        variant={selectedButton === "Über" ? "contained" : "outlined"}
                                        color={selectedButton === "Über" ? "primary" : "error"}
                                        disabled={isLocked === true}
                                        onClick={(event) => handleBetButton(event.currentTarget.dataset.key)}
                                    >
                                        Über
                                    </Button>
                                    <Button
                                        data-key="Unter"
                                        variant={selectedButton === "Unter" ? "contained" : "outlined"}
                                        color={selectedButton === "Unter" ? "primary" : "error"}
                                        disabled={isLocked === true}
                                        onClick={(event) => handleBetButton(event.currentTarget.dataset.key)}
                                    >
                                        Unter
                                    </Button>
                                </Grid>
                            )}
                            {betType === 'question' && (
                                <Grid item xs={10} style={gridItemStyle}>
                                    <Button
                                        data-key="Ja"
                                        variant={selectedButton === "Ja" ? "contained" : "outlined"}
                                        color={selectedButton === "Ja" ? "primary" : "error"}
                                        disabled={isLocked === true}
                                        onClick={(event) => handleBetButton(event.currentTarget.dataset.key)}
                                    >
                                        Ja
                                    </Button>
                                    <Button
                                        data-key="Nein"
                                        variant={selectedButton === "Nein" ? "contained" : "outlined"}
                                        color={selectedButton === "Nein" ? "primary" : "error"}
                                        disabled={isLocked === true}
                                        onClick={(event) => handleBetButton(event.currentTarget.dataset.key)}
                                    >
                                        Nein
                                    </Button>
                                </Grid>
                            )}
                            {betType === '1or2' && (
                                <Grid item xs={10} style={gridItemStyle}>
                                    <Button
                                        data-key="1"
                                        variant={selectedButton === "1" ? "contained" : "outlined"}
                                        color={selectedButton === "1" ? "primary" : "error"}
                                        disabled={isLocked === true}
                                        onClick={(event) => handleBetButton(event.currentTarget.dataset.key)}
                                    >
                                        1
                                    </Button>
                                    <Button
                                        data-key="2"
                                        variant={selectedButton === "2" ? "contained" : "outlined"}
                                        color={selectedButton === "2" ? "primary" : "error"}
                                        disabled={isLocked === true}
                                        onClick={(event) => handleBetButton(event.currentTarget.dataset.key)}
                                    >
                                        2
                                    </Button>
                                </Grid>
                            )}
                            {betType === 'result' && (
                                <Grid item xs={10} style={gridItemStyle}>
                                    <TextField
                                        value={homeResult}
                                        onChange={(e) => setHomeResult(e.target.value)}
                                        autoFocus
                                        type="number"
                                        margin="dense"
                                        id="textFieldHomeResult"
                                        label="Heimteam"
                                        fullWidth
                                        variant="standard"
                                        disabled={isLocked === true}
                                    />
                                    :
                                    <TextField
                                        value={awayResult}
                                        onChange={(e) => setAwayResult(e.target.value)}
                                        autoFocus
                                        type="number"
                                        margin="dense"
                                        id="textFieldAwayResult"
                                        label="Auswärtsteam"
                                        fullWidth
                                        variant="standard"
                                        disabled={isLocked === true}
                                    />
                                </Grid>
                            )}
                            <Grid item xs={1}/>

                            {/* row end */}
                            <Grid item xs={1}/>
                            <Grid item xs={10} style={gridItemStyle}>
                                <Paper variant="outlined">
                                    <Typography style={{wordWrap: 'break-word', overflowWrap: 'break-word'}}>
                                        {betTypes.find((e) => e.key === bet.type)?.sentence ?? ""}{bet.typeCondition}{bet.question}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={1}/>
                        </Grid>
                    </Box>
                )
            }
        </div>
    )
}

export default BetWidget
