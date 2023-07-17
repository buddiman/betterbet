import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import React, { useEffect } from "react";
import api from "../api"

interface EvaluateProps {
    isOpened: boolean
    onClose: () => void
    betId: number
    type: string
}

export default function Evaluate(props: EvaluateProps) {
    const [textFieldValue, setTextFieldValue] = React.useState('');
    const [isOpened, setIsOpened] = React.useState<boolean>(false)

    useEffect(() => {
        setIsOpened(props.isOpened)
    }, [props.isOpened])

    const evaluate = async () => {
        const response = await api.post("/evaluate", {
            betId: props.betId,
            type: props.type,
            result: textFieldValue

        })
        props.onClose()
    }

    const handleClose = () => {
        setIsOpened(false);
        props.onClose()
    };
    return (
        <Dialog open={isOpened} onClose={handleClose}>
            <DialogTitle>Auswerten</DialogTitle>
            <DialogContent>
                <Typography variant="h5">
                    Wette mit der ID {props.betId}
                </Typography>
                <TextField
                    value={textFieldValue}
                    onChange={(e) => setTextFieldValue(e.target.value)}
                    autoFocus
                    margin="dense"
                    id="result"
                    label="Ergebnis"
                    fullWidth
                    variant="standard"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={evaluate}>Auswerten</Button>
            </DialogActions>
        </Dialog>
    )
}