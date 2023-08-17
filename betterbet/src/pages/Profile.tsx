import React, { FC, ReactElement, useState } from "react";
import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";
import api from "../api";
import * as AuthService from "../services/auth.service";

const Profile: FC = (): ReactElement => {
    const [newPassword, setNewPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');

    const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            await api.post('/auth/changePassword', {
                id: AuthService.getCurrentUser().id,
                oldPassword: oldPassword,
                newPassword: newPassword
            })
        } catch (error) {
            console.log(error)
        }
    }

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
            <Grid container spacing={1} justifyContent="center" alignItems="center"
                  style={{width: '100%', height: '100%'}}>
                <Grid item xs={6} sm={6} style={gridItemStyle}/>
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
            </Grid>
        </Box>
    )
}

export default Profile;

