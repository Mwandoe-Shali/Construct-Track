import { AppBar, Toolbar, Button, Typography, IconButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useSelector } from 'react-redux';
import { supabase } from '../lib/supabase';
import { useColorMode } from '../hooks/useColorMode';
import { RootState } from '../store';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, toggleColorMode } = useColorMode();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const getDashboardLabel = () => {
    if (!user) return 'Dashboard';
    return `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard`;
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            ConstrucTrack
          </Typography>
          
          <IconButton 
            color="inherit" 
            onClick={toggleColorMode} 
            sx={{ mr: 2 }}
          >
            {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </IconButton>

          {location.pathname !== '/auth' && (
            <>
              <Button color="inherit" onClick={() => navigate('/')}>
                Home
              </Button>
              <Button color="inherit" onClick={() => navigate('/dashboard')}>
                {getDashboardLabel()}
              </Button>
              <Button color="inherit" onClick={() => navigate('/contact')}>
                Contact
              </Button>
              {location.pathname !== '/' && (
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>
      <main>{children}</main>
    </div>
  );
}