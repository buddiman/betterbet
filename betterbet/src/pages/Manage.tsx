import React from "react";
import {
    Box,
    Button,
    ButtonGroup
} from "@mui/material";
import AddEvent from "../components/AddEvent";
import AddLeague from "../components/AddLeague";
import AddBet from "../components/AddBet";

export default function Manage() {
    const [openAddEvent, setOpenAddEvent] = React.useState(false)
    const [openAddLeague, setOpenAddLeague] = React.useState(false)
    const [openAddBet, setOpenAddBet] = React.useState(false)

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
            <ButtonGroup>
                <Button onClick={handleClickOpenAddEvent}>Spieltag hinzufügen</Button>
                <Button onClick={handleClickOpenAddLeague}>Liga hinzufügen</Button>
                <Button onClick={handleClickOpenAddBet}>Tipp hinzufügen</Button>
            </ButtonGroup>

        </Box>
    );
};