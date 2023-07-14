import React, { ChangeEvent, FC, ReactElement, useEffect, useRef, useState } from "react";
import { Grid, Button, Avatar, Typography, Link, TextField, Stack } from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Bet } from "shared/models/bet";
import axios from "axios";
import IUser from "../types/user.type";
import * as AuthService from "../services/auth.service";
import { BetInstance } from "shared/models/betInstance";

interface BetWidgetProps {
    eventId: number | undefined
}

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
    const [homeResult, setHomeResult] = useState('-')
    const [awayResult, setAwayResult] = useState('-')
    const [isLocked, setIsLocked] = useState(false)

    const handleBetButton = (key: string | undefined) => {
        if (typeof key === "string") {
            console.log(key)
            setSelectedButton(key)
        }
    };

    useEffect(() => {
        const updateBetInstance = async () => {
            const response = await client.put('/betInstance', {
                betId: bet.id,
                userId: currentUser?.id,
                userBet: homeResult + ':' + awayResult,
                points: 0
            })
        }
        if (!(homeResult === '-' || awayResult === '-')) {
            updateBetInstance()
        }

    }, [homeResult, awayResult])

    const client = axios.create({
        baseURL: "http://localhost:8000"
    });

    useEffect(() => {
        const user = AuthService.getCurrentUser()
        setCurrentUser(user)
        console.log(user)
    }, [])


    useEffect(() => {
        console.log("selected button: " + selectedButton)
        const updateBetInstance = async () => {
            const response = await client.put('/betInstance', {
                betId: bet.id,
                userId: currentUser?.id,
                userBet: selectedButton,
                points: 0
            })
        }
        if (bet.type !== 'result') {
            updateBetInstance()
        }
    }, [selectedButton])

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

                const response = await client.get(`/betInstance/${currentUser?.id}/${bet.id}`)
                const betInstance = response.data
                if (response.data.betInstance) {
                    if (bet.type === 'result' && response.data.betInstance.userBet) {
                        const result = response.data.betInstance.userBet.split(':')
                        console.log(result)
                        setHomeResult(result[0])
                        setAwayResult(result[1])
                    }
                    if (bet.type !== 'result' && response.data.betInstance.userBet) {
                        setSelectedButton(response.data.betInstance.userBet)
                    }
                    console.log(betInstance)
                }
            }
        };
        fetchData()
    }, [bet])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await client.get(`/bets/${eventId}`)
                if (response.data.bets.length === 0) {
                    setBets([dummyBet])
                    console.log("EMPTY")
                } else {
                    setBets(response.data.bets)
                }
                if (bet.id) {
                    const responseBetInstance = await client.get(`/betInstance/${currentUser?.id}/${bet.id}`)
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
        setBetIndex((prevIndex) => {
            const newIndex = prevIndex + 1;
            return newIndex < bets.length ? newIndex : prevIndex;
        });
    };

    const handlePreviousBet = () => {
        setBetIndex((prevIndex) => {
            const newIndex = prevIndex - 1;
            return newIndex >= 0 ? newIndex : prevIndex;
        });
    };

    const gridItemStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid black',
        borderRadius: 5,
        padding: 10,
    };

    return (

        <Grid container spacing={2}>
            <Grid item xs={0.5}>
                <Button>
                    <ArrowBackIosIcon onClick={handlePreviousBet}/>
                    {betIndex}
                </Button>
            </Grid>
            <Grid item xs={3} style={gridItemStyle}>
                {bet.teamHomeUrl && (
                    <Avatar
                        alt="Away Team"
                        src={bet.teamHomeUrl}
                        sx={{width: 120, height: 120}}
                        variant="square"
                    />
                )}
            </Grid>
            <Grid item xs={1}/>
            <Grid item xs={1} style={gridItemStyle}>
                <Typography variant="h2" gutterBottom>
                    -
                </Typography>
            </Grid>
            <Grid item xs={1} style={gridItemStyle}>
                <Typography variant="h2" gutterBottom>
                    :
                </Typography>
            </Grid>
            <Grid item xs={1} style={gridItemStyle}>
                <Typography variant="h2" gutterBottom>
                    -
                </Typography>
            </Grid>
            <Grid item xs={1}/>
            <Grid item xs={3} style={gridItemStyle}>
                {bet.teamAwayUrl && (
                    <Avatar
                        alt="Away Team"
                        src={bet.teamAwayUrl}
                        sx={{width: 120, height: 120}}
                        variant="square"
                    />
                )}
            </Grid>
            <Grid item xs={0.5}>
                <Button>
                    <ArrowForwardIosIcon onClick={handleNextBet}/>
                </Button>
            </Grid>

            {/*row end*/}
            <Grid item xs={0.5}/>
            <Grid item xs={3} style={gridItemStyle}>
                <Typography variant="h5" gutterBottom>
                    {bet.teamHomeDescription}
                </Typography>
            </Grid>
            <Grid item xs={5} style={gridItemStyle}>
                <Stack direction="row" spacing={2}>
                    (LAND) - (SPORT) - (LIGA) -
                    {bet.url && (
                        <Link href={bet.url} target="_blank">
                            <OpenInNewIcon/>
                        </Link>
                    )}
                </Stack>
                <Stack direction="row" spacing={2}>
                    <Typography variant="h5" gutterBottom>
                        {bet.date && (
                            new Date(bet.date).toLocaleString('de-DE'))}
                    </Typography>
                </Stack>
            </Grid>
            <Grid item xs={3} style={gridItemStyle}>
                <Typography variant="h5" gutterBottom>
                    {bet.teamAwayDescription}
                </Typography>
            </Grid>
            <Grid item xs={0.5}/>

            {/* row end
                    start bet controls*/}
            <Grid item xs={0.5}/>
            {betType === '1X2' && (
                <Grid item xs={11} style={gridItemStyle}>
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
                <Grid item xs={11} style={gridItemStyle}>
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
                <Grid item xs={11} style={gridItemStyle}>
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
                <Grid item xs={11} style={gridItemStyle}>
                    <Button
                        data-key="ja"
                        variant={selectedButton === "Ja" ? "contained" : "outlined"}
                        color={selectedButton === "Ja" ? "primary" : "error"}
                        disabled={isLocked === true}
                        onClick={(event) => handleBetButton(event.currentTarget.dataset.key)}
                    >
                        Ja
                    </Button>
                    <Button
                        data-key="nein"
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
                <Grid item xs={11} style={gridItemStyle}>
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
                <Grid item xs={11} style={gridItemStyle}>
                    <TextField
                        value={homeResult}
                        onChange={(e) => setHomeResult(e.target.value)}
                        autoFocus
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
                        margin="dense"
                        id="textFieldAwayResult"
                        label="Auswärtsteam"
                        fullWidth
                        variant="standard"
                        disabled={isLocked === true}
                    />
                </Grid>
            )}
            <Grid item xs={0.5}/>

            {/* row end */}
            <Grid item xs={0.5}/>
            <Grid item xs={3} style={gridItemStyle}>
            </Grid>
            <Grid item xs={5} style={gridItemStyle}>
                <Typography style={{wordWrap: 'break-word', overflowWrap: 'break-word'}}>
                    {bet.type} - {bet.typeCondition} - {bet.question}
                </Typography>
            </Grid>
            <Grid item xs={3} style={gridItemStyle}>
            </Grid>
        </Grid>
    )
}

export default BetWidget
