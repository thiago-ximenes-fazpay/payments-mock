import BoletoList from '@/components/BoletoList';
import CreateBoletoForm from '@/components/CreateBoletoForm';
import connectDB from '@/server/db/mongoose';
import { Box, Typography } from '@mui/material';
import { Suspense } from 'react';
import { getBoletos } from './actions';

export default async function Home() {
  await connectDB();
  const _boletos = await getBoletos();

  const boletos = _boletos.map((_b) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {_id, ...boleto} = _b.toObject();
    return {
      ...boleto,
    };
  });

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
