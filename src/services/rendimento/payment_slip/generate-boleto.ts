import { RendimentoBoletoResponse } from "@/interfaces/rendimento-boleto.interface";
import BarcodeGenerator from "@/services/BarcodeGenerator";
import { faker } from "@faker-js/faker";

export const generateBoleto = () =>  ({
  linhaDigitavel: BarcodeGenerator.generateBarcode('BANCO'),
  codigoDeBarras: BarcodeGenerator.generateBarcode('BANCO'),
  nomeBeneficiario: faker.person.fullName(),
  cnpjcpfBeneficiario: faker.helpers.arrayElement(
    [
      faker.string.numeric(11),
      faker.string.numeric(14)
    ]
  ),
  nomePagador: faker.person.fullName(),
  dataVencimento: faker.date.future().toISOString().split('T')[0],
  valor: faker.number.float({ min: 10, max: 1000 }),
  multa: faker.number.float({ min: 0, max: 10 }),
  desconto: faker.number.float({ min: 0, max: 10 }),
  juros: faker.number.float({ min: 0, max: 10 }),
} as const as RendimentoBoletoResponse)