import React, { useState, FormEvent } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { createUser } from '../api/client/users-client';

const RegisterPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await createUser({
                userName: username,
                email: email,
                password: password,
            });

            setSuccess('Registration successful! You can now log in.');
        } catch (err) {
            setError(err instanceof Error ? err.message + 'Registration failed. Please check your input.' : 'Registration failed. Please check your input.');
        }
    };

    return (
        <Box maxWidth={400} mx="auto" mt={8} p={3} boxShadow={3} borderRadius={2}>
            <Typography variant="h5" mb={2}>Register</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
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
                    Register
                </Button>
            </form>
        </Box>
    );
};

export default RegisterPage;
