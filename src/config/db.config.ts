import { env } from "../lib/envManager";

export const dbConfig = {
  URL: env('DB_URL')
}