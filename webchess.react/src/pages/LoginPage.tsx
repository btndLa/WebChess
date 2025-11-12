import React, { useState, FormEvent } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { useUserContext } from '../contexts/UserContext';
import { useLocation, useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const userContext = useUserContext();
    const navigate = useNavigate();
    const location = useLocation();
    const [userName, setUserName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        try {
            await userContext.handleLogin({ userName, password });
            if (location.state?.loginRedirect) {
                navigate(location.state.loginRedirect);
            } else {
                navigate("/");
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Login failed. Please check your credentials.');
        }
    };

    return (
        <Box maxWidth={400} mx="auto" mt={8} p={3} boxShadow={3} borderRadius={2}>
            <Typography variant="h5" mb={2}>Login</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Username"
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    Login
                </Button>
            </form>
        </Box>
    );
};

export default LoginPage;
