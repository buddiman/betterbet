import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import api from "../api"
import BetButtons from "./BetButtons";

interface EvaluateProps {
    isOpened: boolean
    onClose: () => void
    betId: number
    type: string
}

export default function Evaluate(props: EvaluateProps) {
    const [isOpened, setIsOpened] = React.useState<boolean>(false)
    const [result, setResult] = React.useState('')
    const [homeResult, setHomeResult] = useState('-')
    const [awayResult, setAwayResult] = useState('-')
    const [selectedButton, setSelectedButton] = useState('')

    useEffect(() => {
        setIsOpened(props.isOpened)
    }, [props.isOpened])

    const handleBetButton = (key: string | undefined) => {
        if (typeof key === "string") {
            setResult(key);
            setSelectedButton(key)
        }
    };

    const evaluate = async () => {
        if (props.type === "result") {
            if(homeResult !== '' && awayResult !== '') {
                const response = await api.post("/evaluate", {
                    betId: props.betId,
                    type: props.type,
                    result: homeResult.trim() + ":" + awayResult.trim()

                })
            } else {
                console.log("Invalid inputs!")
            }
        } else {
            const response = await api.post("/evaluate", {
                betId: props.betId,
                type: props.type,
                result: result

            })
        }
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
                {props.type === '1X2' && (
                    <BetButtons buttonList={["1", "X", "2"]} selectedButton={selectedButton} disabled={false}
                                onValueChange={handleBetButton}/>
                )}
                {(props.type === 'winner' || props.type === '1or2') && (
                    <BetButtons buttonList={["1", "2"]} selectedButton={selectedButton} disabled={false}
                                onValueChange={handleBetButton}/>
                )}
                {props.type === 'overunder' && (
                    <BetButtons buttonList={["Über", "Unter"]} selectedButton={selectedButton} disabled={false}
                                onValueChange={handleBetButton}/>
                )}
                {props.type === 'question' && (
                    <BetButtons buttonList={["Ja", "Nein"]} selectedButton={selectedButton} disabled={false}
                                onValueChange={handleBetButton}/>
                )}
                {props.type === 'result' && (
                    <div>
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
                        />
                    </div>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={evaluate}>Auswerten</Button>
            </DialogActions>
        </Dialog>
    )
}