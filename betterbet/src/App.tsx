import React, { useEffect, useState } from 'react'
import {
    AppBar, Avatar, BottomNavigation, BottomNavigationAction,
    Box, Button, Container,
    CssBaseline, IconButton, Menu,
    Stack,
    Toolbar, Tooltip,
    Typography
} from "@mui/material"
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import IUser from "./types/user.type";
import * as AuthService from "./services/auth.service";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Bets from "./pages/Bets";
import Manage from "./pages/Manage";
import Statistics from "./pages/Statistics"
import Profile from "./pages/Profile";

function App() {
    const [userIsAdmin, setUserIsAdmin] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<IUser | undefined>(undefined);

    const isMobile = window.matchMedia('(max-width: 767px)').matches

    const [bottomNavValue, setBottomNavValue] = React.useState(0);

    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const navigate = useNavigate();

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = (key: string | undefined) => {
        console.log(key)
        if (typeof key === "string") {
            if (key === "dashboard") {
                navigate('/')
            } else {
                navigate('/' + key)
            }
        }
        setAnchorElNav(null);
    };

    const handleCloseNavMenuDefault = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = (key: string | undefined) => {
        if (typeof key === "string") {
            navigate('/' + key)
        }
        setAnchorElUser(null);
    };

    const handleCloseUserMenuDefault = () => {
        setAnchorElUser(null);
    };

    const handleCloseLogout = () => {
        logOut()
        navigate('/')
        setAnchorElUser(null);
    };

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
                {isMobile ? (
                    <BottomNavigation
                        showLabels
                        value={bottomNavValue}
                        onChange={(event, newValue) => {
                            setBottomNavValue(newValue);
                        }}
                    >
                        <BottomNavigationAction href="/" label="Dashboard"/>
                        {currentUser ? (
                            [<BottomNavigationAction href="/bets" label="Meine Tipps"/>,
                                <BottomNavigationAction href="/statistics" label="Statistik"/>,
                                <BottomNavigationAction href="/" label="Logout" onClick={logOut}/>]
                        ) : (
                            [<BottomNavigationAction href="/login" label="Login"/>,
                                <BottomNavigationAction href="/register" label="Registrieren"/>]
                        )}
                    </BottomNavigation>
                ) : (
                    <AppBar position="static">
                        <CssBaseline/>
                        <Container maxWidth="xl">
                            <Toolbar disableGutters>
                                <SportsBasketballIcon sx={{display: {xs: 'none', md: 'flex'}, mr: 1}}/>
                                <Typography
                                    variant="h6"
                                    noWrap
                                    component="a"
                                    href="/"
                                    sx={{
                                        mr: 2,
                                        display: {xs: 'none', md: 'flex'},
                                        fontFamily: 'monospace',
                                        fontWeight: 700,
                                        letterSpacing: '.3rem',
                                        color: 'inherit',
                                        textDecoration: 'none',
                                    }}
                                >
                                    Tippspiel
                                </Typography>

                                <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                                    <IconButton
                                        size="large"
                                        aria-label="account of current user"
                                        aria-controls="menu-appbar"
                                        aria-haspopup="true"
                                        onClick={handleOpenNavMenu}
                                        color="inherit"
                                    >
                                        <MenuIcon/>
                                    </IconButton>
                                    <Menu
                                        id="menu-appbar"
                                        anchorEl={anchorElNav}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'left',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left',
                                        }}
                                        open={Boolean(anchorElNav)}
                                        onClose={handleCloseNavMenuDefault}
                                        sx={{
                                            display: {xs: 'block', md: 'none'},
                                        }}
                                    >
                                        <MenuItem key="dashboard"
                                                  onClick={(event) => handleCloseNavMenu(event.currentTarget.dataset.key)}>
                                            <Typography textAlign="center">Dashboard</Typography>
                                        </MenuItem>
                                        <MenuItem key="bets"
                                                  onClick={(event) => handleCloseNavMenu(event.currentTarget.dataset.key)}>
                                            <Typography textAlign="center">Meine Tipps</Typography>
                                        </MenuItem>
                                        <MenuItem key="login"
                                                  onClick={(event) => handleCloseNavMenu(event.currentTarget.dataset.key)}>
                                            <Typography textAlign="center">Meine Tipps</Typography>
                                        </MenuItem>
                                        <MenuItem key="register"
                                                  onClick={(event) => handleCloseNavMenu(event.currentTarget.dataset.key)}>
                                            <Typography textAlign="center">Meine Tipps</Typography>
                                        </MenuItem>
                                        <MenuItem key="manage"
                                                  onClick={(event) => handleCloseNavMenu(event.currentTarget.dataset.key)}>
                                            <Typography textAlign="center">Meine Tipps</Typography>
                                        </MenuItem>
                                        <MenuItem key="statistics"
                                                  onClick={(event) => handleCloseNavMenu(event.currentTarget.dataset.key)}>
                                            <Typography textAlign="center">Meine Tipps</Typography>
                                        </MenuItem>
                                    </Menu>
                                </Box>
                                <SportsBasketballIcon sx={{display: {xs: 'flex', md: 'none'}, mr: 1}}/>
                                <Typography
                                    variant="h5"
                                    noWrap
                                    component="a"
                                    href=""
                                    sx={{
                                        mr: 2,
                                        display: {xs: 'flex', md: 'none'},
                                        flexGrow: 1,
                                        fontFamily: 'monospace',
                                        fontWeight: 700,
                                        letterSpacing: '.3rem',
                                        color: 'inherit',
                                        textDecoration: 'none',
                                    }}
                                >
                                    Tippspiel
                                </Typography>
                                <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                                    <Button
                                        key="dashboard"
                                        data-key="dashboard"
                                        onClick={(event) => handleCloseNavMenu(event.currentTarget.dataset.key)}
                                        sx={{my: 2, color: 'white', display: 'block'}}
                                    >
                                        Dashboard
                                    </Button>
                                    {currentUser ? (
                                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                                            <Button
                                                key="bets"
                                                data-key="bets"
                                                onClick={(event) => handleCloseNavMenu(event.currentTarget.dataset.key)}
                                                sx={{my: 2, color: 'white', display: 'block'}}
                                            >
                                                Meine Tipps
                                            </Button>
                                            <Button
                                                key="statistics"
                                                data-key="statistics"
                                                onClick={(event) => handleCloseNavMenu(event.currentTarget.dataset.key)}
                                                sx={{my: 2, color: 'white', display: 'block'}}
                                            >
                                                Statistik
                                            </Button>
                                            {userIsAdmin && (
                                                <Button
                                                    key="manage"
                                                    data-key="manage"
                                                    onClick={(event) => handleCloseNavMenu(event.currentTarget.dataset.key)}
                                                    sx={{my: 2, color: 'white', display: 'block'}}
                                                >
                                                    Manage
                                                </Button>
                                            )}
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                                            <Button
                                                key="login"
                                                data-key="login"
                                                onClick={(event) => handleCloseNavMenu(event.currentTarget.dataset.key)}
                                                sx={{my: 2, color: 'white', display: 'block'}}
                                            >
                                                Login
                                            </Button>
                                            <Button
                                                key="register"
                                                data-key="register"
                                                onClick={(event) => handleCloseNavMenu(event.currentTarget.dataset.key)}
                                                sx={{my: 2, color: 'white', display: 'block'}}
                                            >
                                                Registrieren
                                            </Button>
                                        </div>
                                    )}
                                </Box>

                                {currentUser && (
                                    <Box sx={{flexGrow: 0}}>
                                        <Tooltip title="Open settings">
                                            <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                                <AccountCircle/>
                                            </IconButton>
                                        </Tooltip>
                                        <Menu
                                            sx={{mt: '45px'}}
                                            id="menu-appbar"
                                            anchorEl={anchorElUser}
                                            anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            keepMounted
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            open={Boolean(anchorElUser)}
                                            onClose={handleCloseUserMenuDefault}
                                        >
                                            <MenuItem key="profile" data-key="profile" onClick={(event) => handleCloseUserMenu(event.currentTarget.dataset.key)}>
                                                <Typography textAlign="center">Profil</Typography>
                                            </MenuItem>
                                            <MenuItem key="logout" onClick={handleCloseLogout}>
                                                <Typography textAlign="center">Logout</Typography>
                                            </MenuItem>
                                        </Menu>
                                    </Box>
                                )}
                            </Toolbar>
                        </Container>
                    </AppBar>
                )}
                <Box>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/manage" element={<Manage/>}/>
                        <Route path="/bets" element={<Bets/>}/>
                        <Route path="/statistics" element={<Statistics/>}/>
                        <Route path="/profile" element={<Profile/>}/>
                    </Routes>
                </Box>
            </LocalizationProvider>
        </div>
    );
}

export default App;
