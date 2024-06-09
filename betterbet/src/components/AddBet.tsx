import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    TextField
} from "@mui/material";
import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect } from "react";
import api from "../api"
import { Event } from "shared/models/event"
import { DateTimePicker } from "@mui/x-date-pickers";
import { League } from "shared/models/league";
import { SportType } from "shared/models/sportType";

interface AddBetProps {
    isOpened: boolean
    onClose: () => void
}

export default function AddBet(props: AddBetProps) {
    const [eventList, setEventList] = React.useState<Event[]>([])
    const [leagueList, setLeagueList] = React.useState<League[]>([])
    const [sportTypeList, setSportTypeList] = React.useState<SportType[]>([])
    const [textFieldHomeTeamValue, setTextFieldHomeTeamValue] = React.useState('')
    const [textFieldAwayTeamValue, setTextFieldAwayTeamValue] = React.useState('')
    const [textFieldHomeUrlValue, setTextFieldHomeUrlValue] = React.useState('')
    const [textFieldAwayUrlValue, setTextFieldAwayUrlValue] = React.useState('')
    const [textFieldUrlValue, setTextFieldUrlValue] = React.useState('')
    const [textFieldQuestionValue, setTextFieldQuestionValue] = React.useState('')
    const [eventIdValue, setEventIdValue] = React.useState<any>(null)
    const [leagueIdValue, setLeagueIdValue] = React.useState<any>(null)
    const [typeValue, setTypeValue] = React.useState('')
    const [typeConditionValue, setTypeConditionValue] = React.useState('')
    const [datePickerValue, setDatePickerValue] = React.useState<Dayjs | null>(null);
    const [textFieldScrapeValue, setTextFieldScrapeValue] = React.useState('')

    const [isOpened, setIsOpened] = React.useState<boolean>(false)

    useEffect(() => {
        setIsOpened(props.isOpened)
    }, [props.isOpened])

    useEffect(() => {
        const fetchData = async () => {
            try {
                if(isOpened) {
                    const response = await api.get("/events")
                    setEventList(response.data.event.reverse());
                    const leagueResponse = await api.get("/leagues")
                    setLeagueList(leagueResponse.data.league)
                }
            } catch (error) {
                console.error('Error fetching data from API:', error);
            }
        };
        fetchData();
    }, [isOpened])

    const addBet = async () => {
        const bet = {
            date: datePickerValue,
            eventId: eventIdValue,
            leagueId: leagueIdValue,
            question: textFieldQuestionValue,
            result: null,
            teamAwayDescription: textFieldAwayTeamValue,
            teamAwayUrl: textFieldAwayUrlValue,
            teamHomeDescription: textFieldHomeTeamValue,
            teamHomeUrl: textFieldHomeUrlValue,
            type: typeValue,
            typeCondition: typeConditionValue,
            url: textFieldUrlValue,
            id: undefined
        }
        await api.post("/bet", bet)
        props.onClose()
    }

    const handleScrape = async () => {
        const response = await api.post("/scrape", {
            url: textFieldScrapeValue
        })
        const data = response.data.scrapeData.bet
        const dateTime = new Date(data.date)
        setTextFieldHomeTeamValue(data.teamHomeDescription)
        setTextFieldAwayTeamValue(data.teamAwayDescription)
        setTextFieldUrlValue(data.url)
        setTextFieldHomeUrlValue(data.teamHomeUrl)
        setTextFieldAwayUrlValue(data.teamAwayUrl)
        setDatePickerValue(dayjs(dateTime))

        const leagueResponse = await api.get("/leagues")
        setLeagueList(leagueResponse.data.league)
        setLeagueIdValue(data.leagueId)
    }

    const handleDateChange = (date: Dayjs | null) => {
        setDatePickerValue(dayjs(date));
    };

    const handleSelectEventChange = (event: SelectChangeEvent<any>) => {
        const selectedEventId = event.target.value as string;
        const selectedEvent = eventList.find(event => event.id === parseInt(selectedEventId));
        setEventIdValue(selectedEvent?.id || null);
    };

    const handleSelectLeagueChange = (event: SelectChangeEvent<any>) => {
        const selectedLeagueId = event.target.value as string;
        const selectedLeague = leagueList.find(league => league.id === parseInt(selectedLeagueId));
        setLeagueIdValue(selectedLeague?.id || null);
    };

    const handleTypeChange = (event: SelectChangeEvent<string>) => {
        setTypeValue(event.target.value);
    }


    const handleClose = () => {
        setIsOpened(false);
        props.onClose()
    }

    return (
        <Dialog open={isOpened} onClose={handleClose} fullWidth={true} maxWidth={"md"}>
            <DialogTitle>Tipp hinzufügen</DialogTitle>
            <DialogContent>
                <Stack direction="row" spacing={2}>
                    <InputLabel id="select-label">Spieltag</InputLabel>
                    <Select
                        labelId="select-label"
                        id="eventSelect"
                        sx={{width: '200px'}}
                        value={eventIdValue || ''}
                        onChange={handleSelectEventChange}
                    >
                        {eventList.map((event) => (
                            <MenuItem key={event.id} value={event.id}>
                                {event.name}
                            </MenuItem>
                        ))}
                    </Select>
                    <InputLabel id="type-label">Tippart</InputLabel>
                    <Select
                        labelId="type-label"
                        id="typeSelect"
                        sx={{width: '200px'}}
                        value={typeValue}
                        onChange={handleTypeChange}
                    >
                        {betTypes.map((option, index) => (
                            <MenuItem key={index} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </Stack>
                <Stack direction="row" spacing={2}>
                    <InputLabel id="select-league-label">Liga</InputLabel>
                    <Select
                        labelId="select-league-label"
                        sx={{width: '200px'}}
                        id="leagueSelect"
                        value={leagueIdValue || ''}
                        onChange={handleSelectLeagueChange}
                    >
                        {leagueList.map((league) => (
                            <MenuItem key={league.id} value={league.id}>
                                {league.name + " | " + league.sportTypeId}
                            </MenuItem>
                        ))}
                    </Select>
                    <TextField
                        value={typeConditionValue}
                        onChange={(e) => setTypeConditionValue(e.target.value)}
                        autoFocus
                        margin="dense"
                        id="textFieldTypeCondition"
                        label="Condition (Optional)"
                        fullWidth
                        variant="standard"
                    />
                </Stack>
                <Stack direction="row" spacing={2}>
                    <TextField
                        value={textFieldQuestionValue}
                        onChange={(e) => setTextFieldQuestionValue(e.target.value)}
                        autoFocus
                        margin="dense"
                        id="textFieldQuestionValue"
                        label="Frage (Optional)"
                        fullWidth
                        variant="standard"
                    />
                </Stack>
                <Stack direction="row" spacing={2}>
                    <TextField
                        value={textFieldHomeTeamValue}
                        onChange={(e) => setTextFieldHomeTeamValue(e.target.value)}
                        autoFocus
                        margin="dense"
                        id="textFieldHomeTeamValue"
                        label="Heimteam"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        value={textFieldAwayTeamValue}
                        onChange={(e) => setTextFieldAwayTeamValue(e.target.value)}
                        autoFocus
                        margin="dense"
                        id="textFieldAwayTeamValue"
                        label="Auswärtsteam"
                        fullWidth
                        variant="standard"
                    />
                </Stack>
                <Stack direction="row" spacing={2}>
                    <TextField
                        value={textFieldHomeUrlValue}
                        onChange={(e) => setTextFieldHomeUrlValue(e.target.value)}
                        autoFocus
                        margin="dense"
                        id="textFieldHomeUrlValue"
                        label="URL Logo Heim"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        value={textFieldAwayUrlValue}
                        onChange={(e) => setTextFieldAwayUrlValue(e.target.value)}
                        autoFocus
                        margin="dense"
                        id="textFieldAwayUrlValue"
                        label="URL Logo Auwärts"
                        fullWidth
                        variant="standard"
                    />
                </Stack>
                <TextField
                    value={textFieldUrlValue}
                    onChange={(e) => setTextFieldUrlValue(e.target.value)}
                    autoFocus
                    margin="dense"
                    id="url"
                    label="Link"
                    fullWidth
                    variant="standard"
                />
                <DateTimePicker label="Datum" value={datePickerValue} onChange={handleDateChange}/>
                <Stack direction="row" spacing={2}>
                    <TextField
                        value={textFieldScrapeValue}
                        onChange={(e) => setTextFieldScrapeValue(e.target.value)}
                        autoFocus
                        margin="dense"
                        id="scrape-url"
                        label="Scrape Link"
                        fullWidth
                        variant="standard"
                    />
                    <Button onClick={handleScrape}>Scrape</Button>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={addBet}>Erstellen</Button>
            </DialogActions>
        </Dialog>
    )
}

const betTypes = [
    "1X2",
    "result",
    "winner",
    "overunder",
    "question",
    "1or2",
    "placement",
    "half-fulltime"
]