import { getBoletoByBarCode } from "@/app/actions";
import { HttpStatus } from "@/constants/HttpStatus";
import { RendimentoCIPPaymentResponse } from "@/types/rendimento-cip-payment-response";
import { hasRendimentoToken } from "@/utils/rendimento-token.middleware";
import { fakerPT_BR } from "@faker-js/faker";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (!hasRendimentoToken(req.headers.get('access_token')!)) {
    return NextResponse.json({
      error: 'Unauthorized',
    },
      {
        status: HttpStatus.UNAUTHORIZED,
      })
  }

  const {barCode, valorDoPagamento} = (await req.json());

  const boleto = await getBoletoByBarCode(barCode);

  if (!boleto) {
    return NextResponse.json({
      error: 'Boleto not found',
    }, {
      status: HttpStatus.NOT_FOUND,
    })
  }

  const redimentoCIPPaymentResponse:  RendimentoCIPPaymentResponse = {
    cliente: fakerPT_BR.person.fullName(),
    agencia: fakerPT_BR.string.numeric(4),
    conta: fakerPT_BR.string.numeric(8),
    codigoBanco: fakerPT_BR.string.numeric(3),
    codigoControleCliente: fakerPT_BR.string.numeric(20),
    dataPagamento: fakerPT_BR.date.future().toISOString().split('T')[0],
    documento: fakerPT_BR.string.numeric(11),
    produto: fakerPT_BR.string.numeric(4),
    status: fakerPT_BR.string.numeric(1),
    tipoTransacao: fakerPT_BR.string.numeric(1),
    transacaoId: fakerPT_BR.string.numeric(20),
    valorPago: boleto.valor,
    detalhesComprovante: {
      autenticacao: fakerPT_BR.string.numeric(6),
      codigoDeBarras: boleto.codigoDeBarras,
      dataEfetivacao: fakerPT_BR.date.future().toISOString().split('T')[0],
      favorecido: boleto.nomeBeneficiario ?? fakerPT_BR.person.fullName(),
      linhaDigitavel: boleto.linhaDigitavel,
      nsu: fakerPT_BR.string.numeric(6),
      valorEfetivado: valorDoPagamento
    }
  }

  return NextResponse.json(redimentoCIPPaymentResponse);
}