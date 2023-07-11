import React from 'react'
import { Box, CssBaseline } from "@mui/material"
import { routes } from "./routes"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

function App() {
    return (
        <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <CssBaseline/>
            <Box
                height="100vh"
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
            >
                <Router>
                    <Navbar />
                    <Routes>
                        {routes.map((route) => (
                            <Route
                                key={route.key}
                                path={route.path}
                                element={<route.component/>}
                            />
                        ))}
                    </Routes>
                </Router>
            </Box>
            </LocalizationProvider>
        </div>
    );
}

export default App;
