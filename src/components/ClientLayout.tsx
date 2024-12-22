'use client';

import { AppBar, Box, Container, Toolbar, Typography, useTheme } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import ThemeSwitcher from './ThemeSwitcher';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale="pt-BR">
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh',
          bgcolor: theme.palette.background.default,
          color: theme.palette.text.primary
        }}
      >
        <AppBar position="static" sx={{ mb: 4 }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Sistema de Boletos
            </Typography>
            <ThemeSwitcher />
          </Toolbar>
        </AppBar>
        <Container component="main" sx={{ flex: 1, mb: 4 }}>
          {children}
        </Container>
      </Box>
    </LocalizationProvider>
  );
}
