import React, { ReactElement, FC, useEffect } from "react";
import {
    Box,
    Button,
    ButtonGroup,
    Grid, IconButton,
    MenuItem,
    Paper,
    Select,
    Table,
    SelectChangeEvent, TableBody, TableCell, TableContainer,
    TableHead,
    TableRow, Tooltip,
    Tab
} from "@mui/material";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Event } from "shared/models/event";
import { Bet } from "shared/models/bet";
import api from "../api";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import { BetInstance } from "shared/models/betInstance";

interface UsernameWithId {
    id: number
    username: string
}

interface BetWithInstances extends Bet {
    BetInstance: BetInstance[]
}

interface PointsPerEvent {
    eventId: number,
    eventName: string,
    pointsPerUser: PointsPerUser[]
}

interface PointsPerUser {
    userId: number,
    points: number,
    hasMostPoints: boolean
}

const Statistics: FC = (): ReactElement => {
    const [eventList, setEventList] = React.useState<Event[] | undefined>([])
    const [userList, setUserList] = React.useState<UsernameWithId[] | undefined>([])
    const [eventIdValue, setEventIdValue] = React.useState<any>(null)
    const [displayedBets, setDisplayedBets] = React.useState<BetWithInstances[] | undefined>(undefined)
    const [tabValue, setTabValue] = React.useState('one');
    const [userPointsPerEvent, setUserPointsPerEvent] = React.useState<PointsPerEvent[]>()

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
    };

    const backgroundColor = (points: number | undefined) => {
        if (points === undefined) {
            return 'red'
        } else {
            if (points < 0) {
                return 'grey';
            } else if (points === 0) {
                return 'red';
            } else if (points === 1) {
                return 'yellow';
            } else if (points === 2) {
                return 'green';
            } else if (points === 3) {
                return 'purple';
            }
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("/events")
                setEventList(response.data.event);
                const usersResponse = await api.get("/users")
                setUserList(usersResponse.data.users)
                const pointsResponse = await api.get('userpointsperevent')
                console.log(pointsResponse.data.data)
                setUserPointsPerEvent(pointsResponse.data.data)
            } catch (error) {
                console.error('Error fetching data from API:', error);
            }
        };
        fetchData();
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/betsWithInstances/${eventIdValue}`)
                const bets: BetWithInstances[] = response.data.bets
                setDisplayedBets(bets.filter(bet => new Date(bet.date) < new Date()))
            } catch (error) {
                console.error('Error fetching data from API:', error);
            }
        };
        fetchData();

    }, [eventIdValue])

    const getBetInstance = async (userId: number, betId: number) => {
        const response = await api.get(`/betInstance/${userId}/${betId}`)
        if (response.data.betInstance) {
            return response.data.betInstance.userBet
        } else {
            return "---"
        }
    }

    const handleSelectEventChange = async (event: SelectChangeEvent<any>) => {
        if (eventList) {
            const selectedEventId = event.target.value as string;
            const selectedEvent = eventList.find(event => event.id === parseInt(selectedEventId));
            setEventIdValue(selectedEvent?.id || null);
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
                <TabContext value={tabValue}>
                    <Grid item xs={12} sm={12}>
                        <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                            <TabList
                                value={tabValue}
                                onChange={handleTabChange}
                                textColor="secondary"
                                indicatorColor="secondary"
                                aria-label="secondary tabs example"
                            >
                                <Tab value="one" label="Spieltagsübersicht"/>
                                <Tab value="two" label="Tippübersicht"/>
                            </TabList>
                        </Box>
                    </Grid>
                    {/*event overview*/}
                    <TabPanel value="one">
                        <Grid item xs={12} sm={12}>
                            <TableContainer component={Paper} style={{maxHeight: 600, minWidth: 1200}}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">Spieltag</TableCell>
                                            {userList && userList.map((e) => (
                                                <TableCell align="center">{e.username}</TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody style={{overflowY: 'auto'}}>
                                        {userPointsPerEvent && userPointsPerEvent.map((e) => (
                                            <TableRow
                                                key={e.eventId}
                                            >
                                                <TableCell
                                                    align="center"
                                                    sx={{
                                                        minWidth: 150,
                                                    }}
                                                >
                                                    {e.eventName}
                                                </TableCell>
                                                {e.pointsPerUser && e.pointsPerUser.map((u) => (
                                                    <TableCell
                                                        key={u.userId + "-" + e.eventId}
                                                        align="center"
                                                        sx={{ backgroundColor: u.hasMostPoints ? "green" : "white" }}
                                                    >
                                                        {u.points}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </TabPanel>

                    {/*bet overview*/}
                    <TabPanel value="two">
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
                            <TableContainer component={Paper} style={{maxHeight: 600}}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">Team 1</TableCell>
                                            <TableCell align="center">Team 2</TableCell>
                                            <TableCell align="center">Typ</TableCell>
                                            <TableCell align="center">Kondition</TableCell>
                                            <TableCell align="center">Frage</TableCell>
                                            {userList && userList.map((e) => (
                                                <TableCell align="center">{e.username}</TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody style={{overflowY: 'auto'}}>
                                        {displayedBets && displayedBets.map((e) => (
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
                                                {userList && userList.map((u) => (
                                                    <TableCell
                                                        align="center"
                                                        sx={{backgroundColor: backgroundColor((e.BetInstance.find((b) => b.userId === u.id)?.points))}}
                                                    >
                                                        {(e.BetInstance.find((b) => b.userId === u.id))?.userBet || "---"}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </TabPanel>
                </TabContext>
            </Grid>
        </Box>
    );
};

export default Statistics;