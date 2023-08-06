import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import api from "../api"
import { SportType } from "shared/models/sportType";

interface AddLeagueProps {
    isOpened: boolean
    onClose: () => void
}

export default function AddLeague(props: AddLeagueProps) {
    const [textFieldNameValue, setTextFieldNameValue] = React.useState('');
    const [textFieldCountryValue, setTextFieldCountryValue] = React.useState('');
    const [sportTypeValue, setSportTypeValue] = React.useState<any>(null)

    const [isOpened, setIsOpened] = React.useState<boolean>(false)
    const [sportTypes, setSportTypes] = useState<SportType[] | undefined>(undefined)

    useEffect(() => {
        setIsOpened(props.isOpened)
    }, [props.isOpened])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseSportTypes = await api.get('/sporttypes')
                setSportTypes(responseSportTypes.data.sportTypes)
            } catch (error) {
                console.error('Error fetching data from API:', error);
            }
        };
        fetchData()
    }, []);

    const addLeague = async () => {
        const league = {
            id: undefined,
            name: textFieldNameValue,
            countryCode: textFieldCountryValue,
            sportTypeId: sportTypeValue.id

        }
        const response = await api.post("/league", league)
        props.onClose()
    }

    const handleClose = () => {
        setIsOpened(false);
        props.onClose()
    };
    return (
        <Dialog open={isOpened} onClose={handleClose}>
            <DialogTitle>Spieltag hinzufügen</DialogTitle>
            <DialogContent>
                <TextField
                    value={textFieldNameValue}
                    onChange={(e) => setTextFieldNameValue(e.target.value)}
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Name"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    value={textFieldCountryValue}
                    onChange={(e) => setTextFieldCountryValue(e.target.value)}
                    autoFocus
                    margin="dense"
                    id="countrycode"
                    label="Country Code"
                    fullWidth
                    variant="standard"
                />
                {/*Replace with https://mui.com/material-ui/react-autocomplete/#country-select*/}
                {sportTypes &&
                    <Autocomplete
                        disablePortal
                        onChange={(e, value) => setSportTypeValue(value)}
                        id="sporttype"
                        options={sportTypes}
                        getOptionLabel={(option) => option.name}
                        sx={{width: 300}}
                        renderInput={(params) => <TextField {...params} label="Sport Type"/>}
                    />
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={addLeague}>Erstellen</Button>
            </DialogActions>
        </Dialog>
    )
}