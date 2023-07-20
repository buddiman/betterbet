import React, { ReactElement, FC, useEffect, useState } from "react";
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import {
    Box, Button,
    Grid,
    Paper, Snackbar,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, TextField,
    Typography
} from "@mui/material";
import api from "../api";
import * as AuthService from "../services/auth.service";
import { login } from "../services/auth.service";

interface UserPoints {
    username: string
    points: number
}

interface MissingBetEvent {
    eventId: number
    name: string
    count: number
}

const Home: FC<any> = (): ReactElement => {
    const [userPoints, setUserPoints] = useState<UserPoints[] | undefined>(undefined)
    const [missingBetEvents, setMissingBetEvents] = useState<MissingBetEvent[] | undefined>(undefined)
    const [newPassword, setNewPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [passwordSnackbarOpen, setPasswordSnackbarOpen] = React.useState(false);

    useEffect(() => {
        const fetchMissingBets = async () => {
            const user = AuthService.getCurrentUser()
            if (!user) {
                return
            }
            const eventsWithMissingBets = await api.post("/missingBetEvents", {
                userId: user.id
            })
            setMissingBetEvents(eventsWithMissingBets.data.events)

        }
        const fetchData = async () => {
            try {
                const response = await api.get("/userpoints")
                setUserPoints(response.data.points)

            } catch (error) {
                console.error('Error fetching data from API:', error);
            }
        };
        fetchData();
        fetchMissingBets()
    }, [])

    const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            const response = await api.post('/auth/changePassword', {
                id: AuthService.getCurrentUser().id,
                oldPassword: oldPassword,
                newPassword: newPassword
            })
            setPasswordSnackbarOpen(true)
        } catch (error) {
            console.log(error)
        }
    }

    const handlePasswordSnackbarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setPasswordSnackbarOpen(false);
    };

    const Alert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => (
        <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
    ));

    const gridItemStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    };

    return (
        <Box sx={{
            flexGrow: 1,
            backgroundColor: 'whitesmoke',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Grid container spacing={3} justifyContent="center" alignItems="center"
                  style={{width: '100%', height: '100%'}}>
                <Grid item xs={12} sm={12}/>
                <Grid item xs={6} sm={6} style={gridItemStyle}>
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
                </Grid>
                <Grid item xs={6} sm={6} style={gridItemStyle}>
                    <Paper>
                        <Typography variant="h6" align="center">
                            Offene Tipps
                        </Typography>
                        <TableContainer component={Paper}>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Spieltag</TableCell>
                                    <TableCell align="center">Anzahl</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {missingBetEvents && missingBetEvents.map((e) => (
                                    <TableRow>
                                        <TableCell align="center">{e.name}</TableCell>
                                        <TableCell align="center">{e.count}</TableCell>
                                    </TableRow>
                                ))
                                }
                            </TableBody>
                        </TableContainer>
                    </Paper>
                </Grid>
                <Grid item xs={6} sm={6} style={gridItemStyle}>
                    <Paper>
                        <Typography variant="h6" align="center">
                            Passwort ändern
                        </Typography>
                        <form onSubmit={handleChangePassword}>
                            <TextField
                                label="Altes Passwort"
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                fullWidth
                                margin="normal"
                                variant="outlined"/>
                            <TextField
                                label="Neues Passwort"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                fullWidth
                                margin="normal"
                                variant="outlined"/>
                            <Button type="submit" variant="contained" color="primary">
                                Passwort ändern
                            </Button>
                        </form>
                    </Paper>
                </Grid>
                <Grid item xs={6} sm={6} style={gridItemStyle}>
                    <Paper>
                        <Typography variant="h6" align="center">
                            Coming Soon
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
            <Snackbar
                open={passwordSnackbarOpen}
                autoHideDuration={6000}
                onClose={handlePasswordSnackbarClose}
            >
                <Alert onClose={handlePasswordSnackbarClose} severity="success">
                    Passwort erfolgreich geändert
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Home;