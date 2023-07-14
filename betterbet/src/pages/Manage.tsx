import React from "react";
import {
    Box,
    Button,
    ButtonGroup
} from "@mui/material";
import AddEvent from "../components/AddEvent";

export default function Manage() {
    const [openAddEvent, setOpenAddEvent] = React.useState(false)

    const handleClickOpenAddEvent = () => {
        setOpenAddEvent(true)
    }

    const handleCloseAddEvent = () => {
        setOpenAddEvent(false);
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
            <ButtonGroup>
                <Button onClick={handleClickOpenAddEvent}>Spieltag hinzufügen</Button>
                <Button>Liga hinzufügen</Button>
                <Button>Tipp hinzufügen</Button>
            </ButtonGroup>

        </Box>
    );
};