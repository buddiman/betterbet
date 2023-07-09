import React from 'react'
import { Box, CssBaseline } from "@mui/material"
import { routes } from "./routes"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"

function App() {
    return (
        <div>
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
        </div>
    );
}

export default App;
