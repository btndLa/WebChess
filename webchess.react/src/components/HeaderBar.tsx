import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../contexts/UserContext';
import { CreateGameDialog } from './CreateGameDialog';
import { JoinGameDialog } from './JoinGameDialog';

const HeaderBar: React.FC = () => { // TODO change these
  const navigate = useNavigate();
  const { loggedIn } = useUserContext();
  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);

  return (
      <>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            onClick={() => navigate('/')}
            sx={{
              flexGrow: 1,
              cursor: 'pointer'
            }}
          >
            WebChess
          </Typography>
          {!loggedIn ? (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button color="inherit" onClick={() => navigate('/register')}>
                Register
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => setCreateOpen(true)}>
                Create Game
              </Button>
              <Button color="inherit" onClick={() => setJoinOpen(true)}>
                Join Game
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <CreateGameDialog open={createOpen} onClose={() => setCreateOpen(false)} />
      <JoinGameDialog open={joinOpen} onClose={() => setJoinOpen(false)} />
    </>
  );
};

export default HeaderBar;