import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AppDrawer from './AppDrawer';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';


export default function NavBar() {

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/users/me/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          localStorage.removeItem("access_token");
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    navigate("/");
  };

  const [drawerOpen, setDrawerOpen] = useState(false);
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ textAlign: 'left', backgroundColor: 'transparent', boxShadow: 'none', paddingBottom: 2 }}>
        <Toolbar>
          <IconButton
            onClick={() => setDrawerOpen(true)}
            size="large"
            edge="start"
            aria-label="menu"
            sx={{ mr: 2, color: 'var(--color-secondary)' }}
          >
            <MenuIcon />
          </IconButton>

          {/* Drawer */}
          <AppDrawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
          />

          <Typography variant="h4" sx={{ flexGrow: 1, fontWeight: 'bold', color: 'var(--color-secondary)', fontFamily: '"Cardo", serif' }}>
            Anthology
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            
            <Button 
                  sx={{ color: 'var(--color-secondary)', fontFamily: '"Cardo", serif' }} 
                  onClick={() => navigate('dashboard')}>Dashboard</Button>
            
            {!loading && (
              user ? (
                <Typography sx={{ color: 'var(--color-primary)', fontFamily: '"Cardo", serif', fontWeight: 'bold', backgroundColor: "var(--color-secondary)", padding: '4px 8px', borderRadius: '9px' }}>
                  Hello, {user.username}
                </Typography>
              ) : (
                <Button variant="contained" 
                        sx={{ backgroundColor: 'var(--color-secondary)', fontFamily: '"Cardo", serif' }}
                        onClick={() => navigate('/login')}>Login/Signup</Button>
              )
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}



