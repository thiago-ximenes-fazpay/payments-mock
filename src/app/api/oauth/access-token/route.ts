import { oauthConfig } from "@/config/oauthConfig";
import { HttpStatus } from "@/constants/HttpStatus";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (req.headers.get('Authorization') !== `Basic ${oauthConfig.basicAuth}`) {
    return NextResponse.json({
      error: 'Unauthorized',
    }, {
      status: HttpStatus.UNAUTHORIZED,
    })
  }

  return NextResponse.json({
    access_token: oauthConfig.bearerToken,
    token_type: 'bearer',
    expires_in: oauthConfig.expiresIn,
  });
}