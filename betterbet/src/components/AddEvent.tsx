import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import React, { useEffect } from "react";
import api from "../api"

interface AddEventProps {
    isOpened: boolean
    onClose: () => void
}

export default function AddEvent(props: AddEventProps) {
    const [textFieldValue, setTextFieldValue] = React.useState('');
    const [datePickerFromValue, setDatePickerFromValue] = React.useState<Date | null>(null);
    const [datePickerToValue, setDatePickerToValue] = React.useState<Date | null>(null);
    const [isOpened, setIsOpened] = React.useState<boolean>(false)

    useEffect(() => {
        setIsOpened(props.isOpened)
    }, [props.isOpened])

    const addEvent = async () => {
        const event = {
            id: undefined,
            name: textFieldValue,
            description: "",
            from: datePickerFromValue,
            to: datePickerToValue
        }
        await api.post("/event", event)
        props.onClose()
    }

    const handleDateFromChange = (date: Date | null) => {
        setDatePickerFromValue(date);
    };

    const handleDateToChange = (date: Date | null) => {
        setDatePickerToValue(date);
    };

    const handleClose = () => {
        setIsOpened(false);
        props.onClose()
    };
    return (
        <Dialog open={isOpened} onClose={handleClose}>
            <DialogTitle>Spieltag hinzufügen</DialogTitle>
            <DialogContent>
                <TextField
                    value={textFieldValue}
                    onChange={(e) => setTextFieldValue(e.target.value)}
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Name"
                    fullWidth
                    variant="standard"
                />
                <DatePicker label="Von" value={datePickerFromValue} onChange={handleDateFromChange}/>
                <DatePicker label="Bis" value={datePickerToValue} onChange={handleDateToChange}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={addEvent}>Erstellen</Button>
            </DialogActions>
        </Dialog>
    )
}