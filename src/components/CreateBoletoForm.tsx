'use client';

import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Card, CardContent, CardHeader, Grid, TextField, InputAdornment, Alert, Snackbar, Button, IconButton, Table, TableBody, TableCell, TableRow } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { generateAutomaticBoleto, createBoleto } from '@/app/actions';
import { BoletoFormData, boletoSchema } from '@/schemas/boleto.schema';
import { DateTime } from 'luxon';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AutoGeneratorButton from '@/components/AutoGeneratorButton';
import { useState } from 'react';
import QrCodeIcon from '@mui/icons-material/QrCode';
import BoletoList from './BoletoList'; // Import the BoletoList component

export default function CreateBoletoForm() {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [boletoCode, setBoletoCode] = useState('');
  const [generatedDate, setGeneratedDate] = useState<Date | null>(null);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<BoletoFormData>({
    resolver: zodResolver(boletoSchema),
    defaultValues: {
      code: '',
      amount: 0,
      dueDate: DateTime.now().plus({ days: 5 }).toISO(),
    },
  });

  const onSubmit = async (data: BoletoFormData) => {
    try {
      await createBoleto(data);
      reset();
      setShowSuccess(true);
      router.refresh();
    } catch (error) {
      setErrorMessage('Erro ao criar boleto. Tente novamente.');
      setShowError(true);
    }
  };

  const handleGenerateAutomatic = async () => {
    console.log('Generating boleto...');
    try {
        setIsGenerating(true);

        // Call the action to generate the boleto
        const generatedBoleto = await generateAutomaticBoleto();

        setShowSuccess(true);
        router.refresh();
    } catch (error) {
        setErrorMessage('Erro ao gerar boleto automático. Tente novamente.');
        setShowError(true);
    } finally {
        setIsGenerating(false);
    }
  };

  const handleGenerateBoletoCode = async () => {
    console.log('Generating boleto code...');
    try {
      const generatedBoletoCode = await generateAutomaticBoleto();
      setBoletoCode(generatedBoletoCode.code);
      setGeneratedDate(new Date());
    } catch (error) {
      setErrorMessage('Erro ao gerar código do boleto. Tente novamente.');
      setShowError(true);
    }
  };

  return (
    <Card>
      <CardHeader
        title="Criar Boleto"
        titleTypographyProps={{ variant: 'h6' }}
        action={
          <AutoGeneratorButton
            onClick={() => handleGenerateAutomatic()}
            loading={isGenerating}
            sx={{ mt: 1 }}
          >
            Gerar Boleto Automaticamente
          </AutoGeneratorButton>
        }
      />
      <CardContent>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Controller
                name="code"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Código do Boleto"
                    error={!!errors.code}
                    helperText={errors.code?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ReceiptIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller
                name="amount"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Valor"
                    type="number"
                    error={!!errors.amount}
                    helperText={errors.amount?.message}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      onChange(isNaN(value) ? 0 : value);
                    }}
                    value={value === 0 ? '' : value}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          R$
                        </InputAdornment>
                      ),
                    }}
                    inputProps={{
                      step: '0.01',
                      min: '0.01',
                      max: '999999.99',
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller
                name="dueDate"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    label="Data de Vencimento"
                    format="dd/MM/yyyy"
                    value={value ? DateTime.fromISO(value) : null}
                    onChange={(newValue) => {
                      onChange(newValue ? newValue.toISO() : null);
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.dueDate,
                        helperText: errors.dueDate?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => reset()}
                >
                  Limpar
                </Button>
                <Button type="submit" variant="contained">
                  Criar Boleto
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button onClick={handleGenerateBoletoCode}>Gerar Código do Boleto</Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>

      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ 
          vertical: 'top',
          horizontal: window?.innerWidth >= 900 ? 'right' : 'center'
        }}
        sx={{
          position: 'fixed',
          zIndex: 9999
        }}
      >
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Boleto criado com sucesso!
        </Alert>
      </Snackbar>

      <Snackbar
        open={showError}
        autoHideDuration={3000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ 
          vertical: 'top',
          horizontal: window?.innerWidth >= 900 ? 'right' : 'center'
        }}
        sx={{
          position: 'fixed',
          zIndex: 9999
        }}
      >
        <Alert
          onClose={() => setShowError(false)}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
}
