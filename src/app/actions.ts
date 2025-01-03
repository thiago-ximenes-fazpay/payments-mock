"use server";

import { RendimentoBoletoResponse } from "@/interfaces/rendimento-boleto.interface";
import Boleto from "@/server/db/boleto.model";
import connectDB from "@/server/db/mongoose";
import BarcodeGenerator from "@/services/BarcodeGenerator";
import { BoletoStatus } from "@/types/boleto";
import { generateRandomCode } from "@/utils/generateData";
import { faker, fakerPT_BR } from "@faker-js/faker";
import { DateTime } from "luxon";
import { revalidatePath } from "next/cache";

export async function getBoletos() {
  await connectDB();
  return Boleto.find().sort({
    _id: -1,
  });
}

export async function createAutomaticBoleto() {
  const value = Number(faker.number.float({ min: 10, max: 10000 }).toFixed(2));
  const multa = Number(faker.number.float({ min: 0, max: 10 }).toFixed(2));
  const juros = Number(faker.number.float({ min: 0, max: 10 }).toFixed(2));
  const valorTotal = value + multa + juros;

  const desconto = Number(faker.number.float({ min: 0, max: 10 }).toFixed(2));

  const newBoleto: RendimentoBoletoResponse = {
    linhaDigitavel: BarcodeGenerator.generateBarcode("BANCO"),
    codigoDeBarras: generateRandomCode(),
    nomeBeneficiario: fakerPT_BR.person.fullName(),
    cnpjcpfBeneficiario: fakerPT_BR.helpers.arrayElement([
      faker.string.numeric(11),
      faker.string.numeric(14),
    ]),
    nomePagador: fakerPT_BR.person.fullName(),
    dataVencimento: fakerPT_BR.date.future().toISOString().split("T")[0],
    valor: value,
    multa,
    desconto,
    juros,
    status: "pending",
    valorTotal: valorTotal - desconto,
  } as const as RendimentoBoletoResponse;

  await connectDB();
  await Boleto.create(newBoleto);

  revalidatePath("/");

  return newBoleto;
}

export async function createBoleto(data: {
  code: string;
  dueDate: string;
  amount: number;
  //optional
  multa?: number;
  desconto?: number;
  juros?: number;
}) {
  const multa = data.multa || 0;
  const desconto = data.desconto || 0;
  const juros = data.juros || 0;
  const valor = data.amount - desconto + multa + juros;
  const valorTotal = data.amount - desconto + multa + juros;

  const newBoleto: Partial<RendimentoBoletoResponse> = {
    ...data,
    status: "pending",
    linhaDigitavel: BarcodeGenerator.generateBarcode("BANCO"),
    codigoDeBarras: data.code,
    nomeBeneficiario: fakerPT_BR.person.fullName(),
    cnpjcpfBeneficiario: fakerPT_BR.helpers.arrayElement([
      faker.string.numeric(11),
      faker.string.numeric(14),
    ]),
    nomePagador: fakerPT_BR.person.fullName(),
    dataVencimento: DateTime.fromISO(data.dueDate).toFormat("yyyy-MM-dd"),
    valor,
    valorTotal,
    multa,
    desconto,
    juros,
  };
  await connectDB();
  await Boleto.create(newBoleto);
  revalidatePath("/");

  return newBoleto;
}

export async function updateBoletoStatus(line: string, status: BoletoStatus) {
  await connectDB();
  await Boleto.updateOne({ linhaDigitavel: line }, { $set: { status } });
  revalidatePath("/");
}

export async function deleteBoleto(line: string) {
  await connectDB();
  await Boleto.deleteOne({ linhaDigitavel: line });
  revalidatePath("/");
}

export async function getBoletoByLine(line: string) {
  await connectDB();
  return Boleto.findOne({ linhaDigitavel: line });
}

export async function getBoletoByBarCode(barCode: string) {
  await connectDB();
  return Boleto.findOne({ codigoDeBarras: barCode });
}
