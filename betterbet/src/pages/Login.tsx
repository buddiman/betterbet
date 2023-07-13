import React, { ReactElement, FC, useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import axios from "axios";

interface LoginFormProps {
    onLoginSuccess: (token: string) => void;
}

const Login: FC<LoginFormProps> = ({onLoginSuccess}): ReactElement => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const client = axios.create({
        baseURL: "http://localhost:8000"
    });
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            const response = await client.post('/auth/login', {
                username,
                password
            })

            if(response.data.success) {
                const token = response.data.jwt;
                console.log(token)
                localStorage.setItem('jwt', token);
                onLoginSuccess(token);
            } else {
                console.log(response.data.message)
            }

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