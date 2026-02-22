import React from 'react';
import { Box, Typography, Link } from '@mui/material';

export default function Footer() {
  return (
<Box 
  component="footer" 
  sx={{ 
    backgroundColor: 'var(--color-primary)', 
    color: 'var(--color-bg-default)',
    padding: 2,
    marginTop: 8
  }}
>
  <Box sx={{ 
    maxWidth: '1400px', 
    margin: '0 auto',
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 2
  }}>
    {/* Logo/Brand */}
    <Typography 
      variant="body1" 
      sx={{ 
        fontFamily: '"Cardo", serif', 
        fontWeight: 700 
      }}
    >
      Anthology
    </Typography>

    {/* Links */}
    <Box sx={{ 
      display: 'flex', 
      gap: 3,
      flexWrap: 'wrap',
      justifyContent: 'center'
    }}>
      <Link 
        href="#" 
        sx={{ 
          color: 'var(--color-bg-default)', 
          textDecoration: 'none',
          fontSize: '0.875rem',
          fontFamily: '"Cardo", serif',
          '&:hover': { textDecoration: 'underline' }
        }}
      >
        Privacy
      </Link>
      <Link 
        href="#" 
        sx={{ 
          color: 'var(--color-bg-default)', 
          textDecoration: 'none',
          fontSize: '0.875rem',
          fontFamily: '"Cardo", serif',
          '&:hover': { textDecoration: 'underline' }
        }}
      >
        Terms
      </Link>
      <Link 
        href="#" 
        sx={{ 
          color: 'var(--color-bg-default)', 
          textDecoration: 'none',
          fontSize: '0.875rem',
          fontFamily: '"Cardo", serif',
          '&:hover': { textDecoration: 'underline' }
        }}
      >
        Contact
      </Link>
    </Box>

    {/* Copyright */}
    <Typography 
      variant="body2" 
      sx={{ 
        fontFamily: '"Cardo", serif',
        opacity: 0.8,
        fontSize: '0.875rem'
      }}
    >
      © 2026 Anthology
    </Typography>
  </Box>
</Box>
  );
}