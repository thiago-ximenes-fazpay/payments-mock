import { DateTime } from 'luxon';
import { BoletoStatus } from '@/types/boleto';

export function formatarData(data: string): string {
  return DateTime.fromISO(data).toFormat('dd/MM/yyyy');
}

export function formatarMoeda(valor: number): string {
    if (typeof valor !== 'number' || isNaN(valor)) {
        return 'Valor inválido';
    }
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

export const formatStatus = (status: BoletoStatus): string => {
  const statusMap: Record<BoletoStatus, string> = {
    pending: 'Pendente',
    paid: 'Pago',
    cancelled: 'Cancelado'
  };
  return statusMap[status];
};

export const getStatusColor = (status: BoletoStatus): 'default' | 'success' | 'error' => {
  const colorMap: Record<BoletoStatus, 'default' | 'success' | 'error'> = {
    pending: 'default',
    paid: 'success',
    cancelled: 'error'
  };
  return colorMap[status];
};
