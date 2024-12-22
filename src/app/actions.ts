'use server';

import { Boleto, BoletoStatus } from '@/types/boleto';
import { revalidatePath } from 'next/cache';
import { DateTime } from 'luxon';

// Array to store boletos in memory
let BOLETOS: Boleto[] = [];

// Generate a random boleto code
function generateBoletoCode() {
  return Math.random().toString(36).substring(2, 15);
}

export async function getBoletos() {
  return [...BOLETOS];
}

function generateRandomDigits(length: number): string {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
}

function generateRandomCode(): string {
  // Formato do código de barras:
  // BBBMC.CCCCC CCCCC.CCCCCC CCCCC.CCCCCC C VVVVVVVVVVVV
  // B = Banco (3)
  // M = Moeda (1)
  // C = Campos livres (20)
  // V = Valor (12)
  
  const banco = '341'; // Itaú
  const moeda = '9';
  const camposLivres = generateRandomDigits(20);
  const valor = generateRandomDigits(10);
  const dv = generateRandomDigits(1);
  
  const codigo = `${banco}${moeda}${camposLivres}${dv}${valor}`;
  
  // Formata para melhor visualização
  return codigo.replace(/^(\d{5})(\d{5})(\d{5})(\d{6})(\d{5})(\d{6})(\d{1})(\d{8})$/,
    '$1.$2 $3.$4 $5.$6 $7 $8');
}

function generateRandomAmount(): number {
  // Gera um valor entre R$ 10,00 e R$ 1000,00
  return Number((Math.random() * 990 + 10).toFixed(2));
}

export async function createAutomaticBoleto() {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 3); // 3 days from now

  const newBoleto: Boleto = {
    id: Math.random().toString(36).substring(7),
    code: generateBoletoCode(),
    amount: Math.floor(Math.random() * 1000) + 100, // Random amount between 100 and 1100
    dueDate: dueDate.toISOString(),
    createdAt: DateTime.now().toISO(),
    status: 'pending',
  };

  BOLETOS.push(newBoleto);
  revalidatePath('/');
  
  return newBoleto;
}

export async function generateAutomaticBoleto() {
  const dueDate = DateTime.now().plus({ days: 5 }).toISO();
  
  const newBoleto: Boleto = {
    id: Math.random().toString(36).substring(7),
    code: generateRandomCode(),
    amount: generateRandomAmount(),
    dueDate,
    status: 'pending',
    createdAt: DateTime.now().toISO(),
  };

  BOLETOS.push(newBoleto);
  revalidatePath('/');
  return newBoleto;
}

export async function createBoleto(data: {
  code: string;
  amount: number;
  dueDate: string;
}) {
  const newBoleto: Boleto = {
    id: Math.random().toString(36).substring(7),
    code: data.code,
    amount: data.amount,
    dueDate: data.dueDate,
    status: 'pending',
    createdAt: DateTime.now().toISO(),
  };

  BOLETOS.push(newBoleto);
  revalidatePath('/');
  
  return newBoleto;
}

export async function updateBoletoStatus(id: string, status: BoletoStatus) {
  BOLETOS = BOLETOS.map((boleto) =>
    boleto.id === id ? { ...boleto, status } : boleto
  );
  revalidatePath('/');
}

export async function deleteBoleto(id: string) {
  BOLETOS = BOLETOS.filter((boleto) => boleto.id !== id);
  revalidatePath('/');
}
