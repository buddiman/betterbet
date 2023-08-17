import { Button, Paper } from "@mui/material";
import React from "react";

interface BetButtonsProps {
    buttonList: string[]
    selectedButton: string
    disabled: boolean
    onValueChange: (value: string) => void;
}

const BetButtons: React.FC<BetButtonsProps> = ({buttonList, selectedButton, disabled, onValueChange}) => {

    const handleBetButton = (key: string | undefined) => {
        if (typeof key === "string") {
            onValueChange(key);
        }
    };

    return (
        <Paper variant="outlined">
            {buttonList.map((e) => (
                <Button
                    data-key={e}
                    variant={selectedButton === e ? "contained" : "outlined"}
                    color={selectedButton === e ? "primary" : "error"}
                    disabled={disabled}
                    onClick={(event) => handleBetButton(event.currentTarget.dataset.key)}
                >
                    {e}
                </Button>
            ))}
        </Paper>
    )
}

export default BetButtons;