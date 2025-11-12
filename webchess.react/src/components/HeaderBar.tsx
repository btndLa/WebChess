import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../contexts/UserContext';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

const HeaderBar: React.FC = () => { // TODO change these
    const navigate = useNavigate();
    const { loggedIn, handleLogout, userName } = useUserContext();

    return (
        <AppBar position="static" elevation={2}>
            <Toolbar>
                <Box
                    onClick={() => navigate('/')}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        mr: 2,
                        '&:hover': {
                            opacity: 0.8
                        }
                    }}
                >
                    <SportsEsportsIcon sx={{ mr: 1, fontSize: 28 }} />
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            letterSpacing: '0.5px'
                        }}
                    >
                        WebChess
                    </Typography>
                </Box>

                <Box sx={{ flexGrow: 1 }} />

                {!loggedIn ? (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            color="inherit"
                            onClick={() => navigate('/login')}
                            startIcon={<LoginIcon />}
                            sx={{
                                textTransform: 'none',
                                fontSize: '1rem',
                                px: 2,
                                '&:hover': {
                                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                                }
                            }}
                        >
                            Login
                        </Button>
                        <Button
                            color="inherit"
                            onClick={() => navigate('/register')}
                            startIcon={<PersonAddIcon />}
                            variant="outlined"
                            sx={{
                                textTransform: 'none',
                                fontSize: '1rem',
                                px: 2,
                                borderColor: 'rgba(255, 255, 255, 0.5)',
                                '&:hover': {
                                    borderColor: 'rgba(255, 255, 255, 0.8)',
                                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                                }
                            }}
                        >
                            Register
                        </Button>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography
                            variant="body1"
                            sx={{
                                display: { xs: 'none', sm: 'block' },
                                fontWeight: 500,
                                opacity: 0.9
                            }}
                        >
                            {userName}
                        </Typography>
                        <Button
                            color="inherit"
                            onClick={() => handleLogout()}
                            startIcon={<LogoutIcon />}
                            variant="outlined"
                            sx={{
                                textTransform: 'none',
                                fontSize: '1rem',
                                px: 3,
                                py: 0.75,
                                borderColor: 'rgba(255, 255, 255, 0.5)',
                                borderRadius: 2,
                                transition: 'all 0.2s',
                                '&:hover': {
                                    borderColor: 'rgba(255, 255, 255, 0.9)',
                                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                                }
                            }}
                        >
                            Logout
                        </Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default HeaderBar;