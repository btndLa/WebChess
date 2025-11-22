import { Box, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface Props {
    message?: string;
}

export function FormError({ message }: Props) {
    if (!message) return null;
    
    return (
        <Box 
            sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                mt: 0.5,
                mb: 1,
                p: 1,
                backgroundColor: 'error.light',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'error.main'
            }}
        >
            <ErrorOutlineIcon 
                sx={{ 
                    fontSize: '1rem', 
                    color: 'error.dark' 
                }} 
            />
            <Typography 
                variant="body2" 
                sx={{ 
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    color: 'text.primary'
                }}
            >
                {message}
            </Typography>
        </Box>
    );
}
