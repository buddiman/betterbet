import { Button } from "@mui/material";
import React, { useEffect } from "react";

interface BetButtonsProps {
    buttonList: string[]
    selectedButton: string
    disabled: boolean
    onValueChange: (value: string) => void;
}

const BetButtons: React.FC<BetButtonsProps> = ({buttonList, selectedButton, disabled, onValueChange}) => {

    const handleBetButton = (key: string | undefined) => {
        if (typeof key === "string") {
            console.log(key)
            onValueChange(key);
        }
    };

    return (
        <div>
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
        </div>
    )
}

export default BetButtons;