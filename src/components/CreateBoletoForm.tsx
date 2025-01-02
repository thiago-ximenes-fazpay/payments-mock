"use client";

import { createAutomaticBoleto, createBoleto } from "@/app/actions";
import AutoGeneratorButton from "@/components/AutoGeneratorButton";
import { BoletoFormData, boletoSchema } from "@/schemas/boleto.schema";
import BarcodeGenerator from "@/services/BarcodeGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import ReceiptIcon from "@mui/icons-material/Receipt";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  InputAdornment,
  Snackbar,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function CreateBoletoForm() {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<BoletoFormData>({
    resolver: zodResolver(boletoSchema),
    defaultValues: {
      code: "",
      amount: 0,
      dueDate: DateTime.now().plus({ days: 5 }).toISO(),
    },
  });

  async function handleGenerateCode() {
    const code = BarcodeGenerator.generateBarcode("OUTROS").replace(/\D/g, "");
    setValue("code", code);
    clearErrors("code");
  }

  const onSubmit = async (data: BoletoFormData) => {
    try {
      setIsGenerating(true);
      await createBoleto(data);
      reset();
      setShowSuccess(true);
      router.refresh();
    } catch (error) {
      setErrorMessage("Erro ao criar boleto. Tente novamente.");
      setShowError(true);
    }
  };

  const handleGenerateAutomatic = async () => {
    try {
      setIsGenerating(true);

      await createAutomaticBoleto();

      setShowSuccess(true);
      router.refresh();
    } catch (error) {
      setErrorMessage("Erro ao gerar boleto automático. Tente novamente.");
      setShowError(true);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader
        title="Criar Boleto"
        titleTypographyProps={{ variant: "h6" }}
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
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
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
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button
                            onClick={handleGenerateCode}
                            variant="outlined"
                            size="small"
                            sx={{
                              color: "white",
                              borderColor: "white",
                              "&:hover": {
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                borderColor: "white",
                              },
                            }}
                          >
                            Gerar
                          </Button>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={3}>
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
                    value={value === 0 ? "" : value}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">R$</InputAdornment>
                      ),
                    }}
                    inputProps={{
                      step: "0.01",
                      min: "0.01",
                      max: "999999.99",
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={2}>
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
              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
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
          </Grid>
        </Box>
      </CardContent>

      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal:
            typeof window !== "undefined" && window?.innerWidth >= 900
              ? "right"
              : "center",
        }}
        sx={{
          position: "fixed",
          zIndex: 9999,
        }}
      >
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Boleto criado com sucesso!
        </Alert>
      </Snackbar>

      <Snackbar
        open={showError}
        autoHideDuration={3000}
        onClose={() => setShowError(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal:
            typeof window !== "undefined" && window?.innerWidth >= 900
              ? "right"
              : "center",
        }}
        sx={{
          position: "fixed",
          zIndex: 9999,
        }}
      >
        <Alert
          onClose={() => setShowError(false)}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
}
