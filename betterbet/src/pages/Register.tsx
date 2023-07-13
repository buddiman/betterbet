import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import axios from 'axios';

interface RegisterFormProps {
    onRegisterSuccess: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const client = axios.create({
        baseURL: "http://localhost:8000"
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await client.post('/auth/register', {
                user: {
                    id: undefined,
                    username: username,
                    password: password,
                    email: email,
                    isAdmin: false
                }
            });

            console.log("Registered new User!")
            onRegisterSuccess();
        } catch (error) {
                console.log(error)
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
            />
            <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                Register
            </Button>
        </form>
    );
};

export default RegisterForm;
