import { getBoletoByLine } from "@/app/actions";
import { HttpStatus } from "@/constants/HttpStatus";
import Boleto from "@/server/db/boleto.model";
import { hasRendimentoToken } from "@/utils/rendimento-token.middleware";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  if (!hasRendimentoToken(req.headers.get('access_token')!)) {
    return NextResponse.json({
      error: 'Unauthorized',
    },
      {
        status: HttpStatus.UNAUTHORIZED,
      })
  }

const body = await req.json();

  const line = body.linhaDigitavel;

  const boleto = await getBoletoByLine(line);

  if (!boleto) {
    return NextResponse.json({
      error: 'Boleto not found',
    }, {
      status: HttpStatus.NOT_FOUND,
    })
  }

  return NextResponse.json({
    value: boleto,
  })
}