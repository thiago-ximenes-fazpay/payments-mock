'use client';

import { deleteBoleto, updateBoletoStatus } from '@/app/actions';
import { RendimentoBoletoResponse } from '@/interfaces/rendimento-boleto.interface';
import { BoletoStatus } from '@/types/boleto';
import { formatarData, formatarMoeda } from '@/utils/formatadores';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface BoletoListProps {
  boletos: RendimentoBoletoResponse[];
}

interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  boletoCode: string;
}

function DeleteDialog({ open, onClose, onConfirm, boletoCode }: DeleteDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirmar Exclusão</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Tem certeza que deseja excluir o boleto {boletoCode}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={onConfirm} color="error">
          Excluir
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const statusColors: Record<BoletoStatus, 'default' | 'success' | 'error'> = {
  pending: 'default',
  paid: 'success',
  cancelled: 'error',
};

const statusLabels: Record<BoletoStatus, string> = {
  pending: 'Pendente',
  paid: 'Pago',
  cancelled: 'Cancelado',
};

export default function BoletoList(props: BoletoListProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBoleto, setSelectedBoleto] = useState<RendimentoBoletoResponse | null>(null);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDelete = async () => {
    if (!selectedBoleto) return;
    
    await deleteBoleto(selectedBoleto.linhaDigitavel);
    setDeleteDialogOpen(false);
    setSelectedBoleto(null);
    router.refresh();
  };

  const handleStatusUpdate = async (id: string, newStatus: BoletoStatus) => {
    await updateBoletoStatus(id, newStatus);
    router.refresh();
  };

  const openDeleteDialog = (boleto: RendimentoBoletoResponse) => {
    setSelectedBoleto(boleto);
    setDeleteDialogOpen(true);
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setShowCopySuccess(true);
    } catch (error) {
      console.error('Erro ao copiar código:', error);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <Card>
      <CardHeader
        title="Lista de Boletos"
        titleTypographyProps={{ variant: 'h6' }}
      />
      <CardContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Vencimento</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.boletos.map((boleto) => (
                <TableRow key={boleto.linhaDigitavel}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box 
                        component="code"
                        sx={{ 
                          fontFamily: 'monospace', 
                          fontSize: '0.875rem',
                          bgcolor: 'action.hover',
                          p: 1,
                          borderRadius: 1,
                          display: 'inline-block',
                          letterSpacing: '0.5px',
                          userSelect: 'all'
                        }}
                      >
                        {boleto.linhaDigitavel}
                      </Box>
                      <Tooltip title="Copiar código">
                        <IconButton
                          size="small"
                          onClick={() => handleCopyCode(boleto.linhaDigitavel)}
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell>{formatarMoeda(boleto.valor)}</TableCell>
                  <TableCell>{formatarData(boleto.dataVencimento)}</TableCell>
                  <TableCell>
                    <Chip
                      label={statusLabels[boleto.status]}
                      color={statusColors[boleto.status]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      {boleto.status === 'pending' && (
                        <>
                          <Tooltip title="Marcar como pago">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleStatusUpdate(boleto.linhaDigitavel, 'paid')}
                            >
                              <CheckCircleIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Cancelar boleto">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleStatusUpdate(boleto.linhaDigitavel, 'cancelled')}
                            >
                              <CancelIcon />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                      <Tooltip title="Excluir boleto">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => openDeleteDialog(boleto)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        boletoCode={selectedBoleto?.linhaDigitavel ?? ''}
      />
      <Snackbar
        open={showCopySuccess}
        autoHideDuration={2000}
        onClose={() => setShowCopySuccess(false)}
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
          onClose={() => setShowCopySuccess(false)}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Código copiado com sucesso!
        </Alert>
      </Snackbar>
    </Card>
  );
}
