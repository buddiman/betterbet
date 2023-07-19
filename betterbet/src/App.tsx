import React, { useEffect, useState } from 'react'
import {
    AppBar,
    Box,
    CssBaseline,
    Stack,
    Toolbar,
    Typography
} from "@mui/material"
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import IUser from "./types/user.type";
import * as AuthService from "./services/auth.service";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Bets from "./pages/Bets";
import Manage from "./pages/Manage";
import Statistics from "./pages/Statistics"

function App() {
    const [userIsAdmin, setUserIsAdmin] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<IUser | undefined>(undefined);

    const logOut = () => {
        AuthService.logout();
        setUserIsAdmin(false);
        setCurrentUser(undefined);
    };

    useEffect(() => {
        const user = AuthService.getCurrentUser()

        if (user) {
            setCurrentUser(user)
            setUserIsAdmin(user.isAdmin)
        }
    }, []);

    const containerStyle: React.CSSProperties = {
        width: '100%',      // Take full available width
        height: '100vh',    // Take full viewport height
        overflow: 'hidden' // Hide any overflow content (optional)
    };

    return (
        <div style={containerStyle}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <CssBaseline/>
                <AppBar position="static">
                    <CssBaseline/>
                    <Toolbar>
                        <Stack direction="row" spacing={2}>
                            <Typography variant="h4">
                                Tippspiel
                            </Typography>
                            <Stack direction="row" spacing={2}>
                                <Link to="/">
                                    <Typography variant="h5">
                                        Dashboard
                                    </Typography>
                                </Link>
                                {userIsAdmin && (
                                    <Link to={"/manage"}>
                                        <Typography variant="h5">
                                            Manage
                                        </Typography>
                                    </Link>
                                )}
                                {currentUser ? (
                                    <Stack direction="row" spacing={2}>
                                        <Link to="/bets">
                                            <Typography variant="h5">
                                                Meine Tipps
                                            </Typography>
                                        </Link>
                                        <Link to="/statistics">
                                            <Typography variant="h5">
                                                Statistik
                                            </Typography>
                                        </Link>
                                        <Link to={"/"} onClick={logOut}>
                                            <Typography variant="h5">
                                                Logout
                                            </Typography>
                                        </Link>
                                    </Stack>
                                ) : (
                                    <Stack direction="row" spacing={2}>
                                        <Link to="/login">
                                            <Typography variant="h5">
                                                Login
                                            </Typography>
                                        </Link>
                                        <Link to="/register">
                                            <Typography variant="h5">
                                                Register
                                            </Typography>
                                        </Link>
                                    </Stack>
                                )
                                }

                            </Stack>
                        </Stack>
                    </Toolbar>
                </AppBar>
                <Box>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/manage" element={<Manage/>}/>
                        <Route path="/bets" element={<Bets/>}/>
                        <Route path="/statistics" element={<Statistics/>}/>
                    </Routes>
                </Box>
            </LocalizationProvider>
        </div>
    );
}

export default App;
