import React, { useState } from 'react';
import { useUserContext } from '../contexts/UserContext';
import { 
    Box, 
    Button, 
    Container, 
    Typography, 
    Paper, 
    Card, 
    CardContent, 
    CardActions,
    Divider 
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { CreateGameDialog } from '../components/CreateGameDialog';
import { JoinGameDialog } from '../components/JoinGameDialog';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const HomePage: React.FC = () => {
    const { loggedIn, userName } = useUserContext();
    const [createOpen, setCreateOpen] = useState(false);
    const [joinOpen, setJoinOpen] = useState(false);

    return (
        <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
            {loggedIn ? (
                <>
                    {/* Welcome Section */}
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        <Typography 
                            variant="h3" 
                            component="h1" 
                            gutterBottom 
                            sx={{ 
                                fontWeight: 700,
                                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Welcome back, {userName}!
                        </Typography>
                        <Divider sx={{ maxWidth: 300, mx: 'auto', mb: 4 }} />
                    </Box>

                    {/* Action Cards */}
                    <Grid container spacing={4} justifyContent="center">
                        {/* Create Game Card */}
                        <Grid size={{ xs: 12, sm: 6, md: 5 }}>
                            <Card 
                                elevation={3}
                                sx={{ 
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: 6,
                                    }
                                }}
                            >
                                <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 4 }}>
                                    <Box 
                                        sx={{ 
                                            display: 'inline-flex',
                                            p: 2,
                                            borderRadius: '50%',
                                            bgcolor: 'primary.light',
                                            mb: 2
                                        }}
                                    >
                                        <SportsEsportsIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                                    </Box>
                                    <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
                                        Create New Game
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                                        Start a new chess game and invite your friend with a unique game code
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                                    <Button 
                                        variant="contained" 
                                        size="large"
                                        onClick={() => setCreateOpen(true)}
                                        startIcon={<SportsEsportsIcon />}
                                        sx={{ 
                                            px: 4,
                                            py: 1.5,
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontSize: '1.1rem'
                                        }}
                                    >
                                        Create Game
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>

                        {/* Join Game Card */}
                        <Grid size={{ xs: 12, sm: 6, md: 5 }}>
                            <Card 
                                elevation={3}
                                sx={{ 
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: 6,
                                    }
                                }}
                            >
                                <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 4 }}>
                                    <Box 
                                        sx={{ 
                                            display: 'inline-flex',
                                            p: 2,
                                            borderRadius: '50%',
                                            bgcolor: 'secondary.light',
                                            mb: 2
                                        }}
                                    >
                                        <PersonAddIcon sx={{ fontSize: 48, color: 'secondary.main' }} />
                                    </Box>
                                    <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
                                        Join Existing Game
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                                        Enter a game code to join your friend's chess match
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                                    <Button 
                                        variant="contained" 
                                        color="secondary"
                                        size="large"
                                        onClick={() => setJoinOpen(true)}
                                        startIcon={<PersonAddIcon />}
                                        sx={{ 
                                            px: 4,
                                            py: 1.5,
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontSize: '1.1rem'
                                        }}
                                    >
                                        Join Game
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Info Section */}
                    <Paper 
                        elevation={2} 
                        sx={{ 
                            mt: 6, 
                            p: 4, 
                            textAlign: 'center',
                            bgcolor: 'background.default',
                            borderRadius: 2
                        }}
                    >
                        <Typography variant="h6" gutterBottom fontWeight={600}>
                            How It Works
                        </Typography>
                        <Grid container spacing={3} sx={{ mt: 2 }}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Typography variant="body2" color="text.secondary">
                                    <strong>1. Create</strong> a new game to get your unique game code
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Typography variant="body2" color="text.secondary">
                                    <strong>2. Share</strong> the code with your friend
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Typography variant="body2" color="text.secondary">
                                    <strong>3. Play</strong> and enjoy your chess match!
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Dialogs */}
                    <CreateGameDialog open={createOpen} onClose={() => setCreateOpen(false)} />
                    <JoinGameDialog open={joinOpen} onClose={() => setJoinOpen(false)} />
                </>
            ) : (
                <Box sx={{ textAlign: 'center', mt: 8 }}>
                    <Typography variant="h4" gutterBottom>
                        Welcome to WebChess
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Please log in to start playing chess with your friends
                    </Typography>
                </Box>
            )}
        </Container>
    );
};

export default HomePage;
