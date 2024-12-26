import { oauthConfig } from "@/config/oauthConfig";
import { HttpStatus } from "@/constants/HttpStatus";
import Boleto from "@/server/db/boleto.model";
import connectDB from "@/server/db/mongoose";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  if (req.headers.get('Authorization') !== `Bearer ${oauthConfig.bearerToken}`) {
    return NextResponse.json(
      {
        error: 'Unauthorized',
      },
      {
        status: HttpStatus.UNAUTHORIZED,
      }
    )
  }

  const line = (await req.json()).line;

  await connectDB();
  const boleto = await Boleto.findOne({ linhaDigitavel: line });

  if (!boleto) {
    return NextResponse.json({
      error: 'Boleto not found',
    }, {
      status: HttpStatus.NOT_FOUND,
    })
  }

  return NextResponse.json({
    boleto,
  })
}
