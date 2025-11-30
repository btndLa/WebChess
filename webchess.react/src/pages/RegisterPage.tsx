import React, { useState, FormEvent } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { createUser } from '../api/client/users-client';
import * as yup from "yup";
import { yupErrorsToObject } from '../utils/form';
import { ServerSideValidationError } from '../api/errors/ServerSideValidationError';
import { HttpError } from '../api/errors/HttpError';
import { FormError } from '../components/FormError';

const registerFormValidator = yup.object({
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup
        .string()
        .min(6, 'Password must be at least 6 characters')
        .matches(/[0-9]/, 'Password must contain at least one digit')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .required('Password is required'),
    username: yup.string().min(2, 'Username must be at least 2 characters').required('Username is required'),
});

export function RegisterPage() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [success, setSuccess] = useState<string>('');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setFormErrors({})
        setSuccess('');

        try {
            await registerFormValidator.validate({ email, password, username }, {abortEarly: false});
            console.log("")
            await createUser({
                userName: username,
                email: email,
                password: password,
            });
            setSuccess('Registration successful! You can now log in.'); 
        } catch (err) {
            if (err instanceof yup.ValidationError) {
                setFormErrors(yupErrorsToObject(err.inner));
            } else if (err instanceof ServerSideValidationError) {
                setFormErrors(err.validationErrors);
            } else if (err instanceof HttpError) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred. Please try again later.');
            }
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
                <FormError message={formErrors.username ? formErrors.username : formErrors.userName} />
                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                <FormError message={formErrors.email} />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                <FormError message={formErrors.password} />
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    Register
                </Button>
            </form>
        </Box>
    );
};
