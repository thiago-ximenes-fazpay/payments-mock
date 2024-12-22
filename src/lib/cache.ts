import { cache } from 'react';
import { Boleto } from '@/types/boleto';

let boletos: Boleto[] = [];

export const getCachedBoletos = cache(() => {
  return boletos;
});

export function setCachedBoletos(newBoletos: Boleto[]) {
  boletos = newBoletos;
  return boletos;
}
