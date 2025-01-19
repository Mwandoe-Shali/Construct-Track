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
    
    // Extract name from email (e.g., manuel+manager@gmail.com -> Manuel)
    const emailParts = user.email.split('@')[0].split('+')[0].split('.');
    const name = emailParts[0];
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    
    return `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} ${formattedName}`;
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
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
              <Button 
                color="inherit" 
                onClick={() => navigate('/')}
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
              >
                Home
              </Button>
              <Button 
                color="inherit" 
                onClick={() => navigate('/dashboard')}
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              >
                {getDashboardLabel()}
              </Button>
              <Button 
                color="inherit" 
                onClick={() => navigate('/contact')}
                className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
              >
                Contact Us
              </Button>
              {location.pathname !== '/' && (
                <Button 
                  color="inherit" 
                  onClick={handleLogout}
                  className="nav-link"
                >
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