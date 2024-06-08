import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Button, ButtonGroup, Paper, Box } from '@mui/material';
import {isDisabled} from "@testing-library/user-event/dist/utils";

interface ReorderableListProps {
    itemsUnordered?: string;
    itemsOrderedByUser?: string;
    isLocked: boolean
    onValueChange: (value: string[]) => void;
}

const ReorderableList: React.FC<ReorderableListProps> = ({ itemsUnordered = '', itemsOrderedByUser = '', onValueChange, isLocked}) => {
    const [items, setItems] = useState<string[]>([]);

    useEffect(() => {
        if(itemsOrderedByUser === '') {
            setItems(itemsUnordered.split(';').filter(item => item.trim() !== ''));
        } else {
            setItems(itemsOrderedByUser.split(';').filter(item => item.trim() !== ''));
        }

    }, [itemsUnordered, itemsOrderedByUser]);

    const moveItemUp = (index: number) => {
        if (index === 0) return;
        const newItems = [...items];
        [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
        setItems(newItems);
        onValueChange(newItems)
    };

    const moveItemDown = (index: number) => {
        if (index === items.length - 1) return;
        const newItems = [...items];
        [newItems[index + 1], newItems[index]] = [newItems[index], newItems[index + 1]];
        setItems(newItems);
        onValueChange(newItems)
    };

    return (
        <Paper variant="outlined" style={{ padding: '10px', maxHeight: '300px', overflowY: 'auto' }}>
            <List>
                {items.map((item, index) => (
                    <ListItem key={index} style={{ display: 'flex', alignItems: 'center', padding: '5px 0' }}>
                        <ListItemText primary={item} style={{ flex: 1 }} />
                        <ButtonGroup variant="contained" size="small">
                            <Button onClick={() => moveItemUp(index)} disabled={index === 0 || isLocked}>Up</Button>
                            <Button onClick={() => moveItemDown(index)} disabled={index === items.length - 1 || isLocked}>Down</Button>
                        </ButtonGroup>
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default ReorderableList;
