'use server';

import { RendimentoBoletoResponse } from '@/interfaces/rendimento-boleto.interface';
import Boleto from '@/server/db/boleto.model';
import BarcodeGenerator from '@/services/BarcodeGenerator';
import { BoletoStatus } from '@/types/boleto';
import { faker, fakerPT_BR } from '@faker-js/faker';
import { DateTime } from 'luxon';
import { revalidatePath } from 'next/cache';

// Generate a random boleto code
function generateBoletoCode() {
  return Math.random().toString(36).substring(2, 15);
}

export async function getBoletos() {
  return Boleto.find().sort({
    _id: -1
  });
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

export async function createAutomaticBoleto() {

  const value = Number((faker.number.float({ min: 10, max: 10000 })).toFixed(2));
  const multa = Number((faker.number.float({ min: 0, max: 10 })).toFixed(2));
  const juros = Number((faker.number.float({ min: 0, max: 10 })).toFixed(2));
  const valorTotal = value + multa + juros;

  const desconto = Number((faker.number.float({ min: 0, max: 10 })).toFixed(2));

  const newBoleto: RendimentoBoletoResponse = {
    linhaDigitavel: BarcodeGenerator.generateBarcode('BANCO'),
    codigoDeBarras: generateRandomCode(),
    nomeBeneficiario: fakerPT_BR.person.fullName(),
    cnpjcpfBeneficiario: fakerPT_BR.helpers.arrayElement(
      [
        faker.string.numeric(11),
        faker.string.numeric(14)
      ]
    ),
    nomePagador: fakerPT_BR.person.fullName(),
    dataVencimento: fakerPT_BR.date.future().toISOString().split('T')[0],
    valor: value,
    multa,
    desconto,
    juros,
    status: 'pending',
    valorTotal: valorTotal - desconto
  } as const as RendimentoBoletoResponse

  await Boleto.create(newBoleto);

  revalidatePath('/');

  return newBoleto;
}

export async function createBoleto(data: {
  code: string;
  amount: number;
  dueDate: string;
}) {
  const newBoleto: Partial<RendimentoBoletoResponse> = {
    ...data,
    status: 'pending',
    linhaDigitavel: BarcodeGenerator.generateBarcode('BANCO'),
    codigoDeBarras: generateBoletoCode(),
    nomeBeneficiario: fakerPT_BR.person.fullName(),
    cnpjcpfBeneficiario: fakerPT_BR.helpers.arrayElement(
      [
        faker.string.numeric(11),
        faker.string.numeric(14)
      ]
    ),
    nomePagador: fakerPT_BR.person.fullName(),
    dataVencimento: DateTime.fromISO(data.dueDate).toFormat('yyyy-MM-dd'),
    valor: data.amount,
    multa: faker.number.float({ min: 0, max: 10 }),
    desconto: faker.number.float({ min: 0, max: 10 }),
    juros: faker.number.float({ min: 0, max: 10 }),
  }


  await Boleto.create(newBoleto);
  revalidatePath('/');

  return newBoleto;
}

export async function updateBoletoStatus(line: string, status: BoletoStatus) {

  await Boleto.updateOne({ linhaDigitavel: line }, { $set: { status } });
  revalidatePath('/');
}

export async function deleteBoleto(line: string) {

  await Boleto.deleteOne({ linhaDigitavel: line });
  revalidatePath('/');
}

export async function getBoletoByLine(line: string) {

  return Boleto.findOne({ linhaDigitavel: line });
}

export async function getBoletoByBarCode(barCode: string) {

  return Boleto.findOne({ codigoDeBarras: barCode });
}