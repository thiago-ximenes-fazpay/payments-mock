import { oauthConfig } from "@/config/oauthConfig";

export function hasRendimentoToken(auth: string) {
  return (auth === `${oauthConfig.bearerToken}`)
}
