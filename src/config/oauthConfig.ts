import { env } from "@/lib/envManager";

export const oauthConfig = {
  expiresIn: 300, 
  bearerToken: env('BEARER_TOKEN'),
  basicAuth: env('BASIC_ACCESS_TOKEN'),
};
