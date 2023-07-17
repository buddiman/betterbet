import React, { ReactElement, FC, useEffect, useState } from "react";
import {
    Box,
    Button,
    Paper,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import api from "../api";

interface UserPoints {
    username: string
    points: number
}

const Home: FC<any> = (): ReactElement => {
    const [userPoints, setUserPoints] = useState<UserPoints[]|undefined>(undefined)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get("/userpoints")
                setUserPoints(response.data.points)
            } catch (error) {
                console.error('Error fetching data from API:', error);
            }
        };
        fetchData();
    }, [])


    return (
        <Box sx={{
            flexGrow: 1,
            backgroundColor: 'whitesmoke',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Paper>
                <Typography variant="h6" align="center">
                    Punktetabelle
                </Typography>
                <TableContainer component={Paper}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">User</TableCell>
                            <TableCell align="center">Punkte</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {userPoints && userPoints.map((e) => (
                            <TableRow>
                                <TableCell align="center">{e.username}</TableCell>
                                <TableCell align="center">{e.points}</TableCell>
                            </TableRow>
                        ))
                        }
                    </TableBody>
                </TableContainer>
            </Paper>
        </Box>
    );
};

export default Home;