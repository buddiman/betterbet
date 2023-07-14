import React, { ReactElement, FC, useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { NavigateFunction, useNavigate } from 'react-router-dom';
import axios from "axios";
import { login } from "../services/auth.service"

interface LoginFormProps {

}

const Login: FC<LoginFormProps> = (): ReactElement => {
    let navigate: NavigateFunction = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            login(username, password).then(
                () => {
                    navigate("/")
                    window.location.reload()
                }
            )
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Box sx={{
            flexGrow: 1,
            backgroundColor: 'whitesmoke',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                />
                <Button type="submit" variant="contained" color="primary">
                    Login
                </Button>
            </form>
        </Box>
    );
};

export default Login;