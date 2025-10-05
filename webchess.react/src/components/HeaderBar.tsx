import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../contexts/UserContext';

const HeaderBar: React.FC = () => {
  const navigate = useNavigate();
  const { loggedIn } = useUserContext();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
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
            <Button color="inherit" onClick={() => navigate('/game')}>
              Play
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default HeaderBar;