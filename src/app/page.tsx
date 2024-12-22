import { getBoletos } from './actions';
import CreateBoletoForm from '@/components/CreateBoletoForm';
import BoletoList from '@/components/BoletoList';
import { Box, Typography } from '@mui/material';
import { Suspense } from 'react';

export default async function Home() {
  const boletos = await getBoletos();

  return (
    <Box 
      component="main"
      sx={{ 
        p: 3, 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 3,
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box'
      }}
    >
      <CreateBoletoForm />
      <Box>
        <Typography variant="h6" gutterBottom>
          Boletos Cadastrados
        </Typography>
        <Suspense fallback={<Typography>Carregando boletos...</Typography>}>
          <BoletoList boletos={boletos} />
        </Suspense>
      </Box>
    </Box>
  );
}
