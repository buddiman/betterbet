import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { register } from "../services/auth.service";
import { NavigateFunction, useNavigate } from "react-router-dom";

interface RegisterFormProps {

}

const RegisterForm: React.FC<RegisterFormProps> = () => {
    let navigate: NavigateFunction = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            register(username, email, password).then(
                () => {
                    navigate("/login")
                    window.location.reload()
                }
            )


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
