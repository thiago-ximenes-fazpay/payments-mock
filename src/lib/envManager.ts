import { config } from 'dotenv';
import { z } from 'zod';

config();

const envSchema = z.object({
  BASIC_ACCESS_TOKEN: z.string().nonempty(),
  BEARER_TOKEN: z.string().nonempty(),
  DB_URL: z.string().url().nonempty(),
});

/**
 * Valida se as variáveis de ambiente obrigatórias estão presentes no process.env e
 * se elas têm valores válidos.
 *
 * @throws {Error} Se alguma variável de ambiente obrigatória estiver faltando ou tiver
 * um valor inválido.
 */
export function validateEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const errorMessages = result.error.errors.map(e => `${e.path.join('.')} ${e.message}`);
    throw new Error(`Variáveis de ambiente faltando ou inválidas: ${errorMessages.join(', ')}`);
  }
}

  /**
   * Obtém o valor de uma variável de ambiente com validação.
   * @param key O nome da variável de ambiente.
   * @throws {Error} Se a variável de ambiente não estiver definida ou for inválida.
   * @returns O valor da variável de ambiente.
   */
export function env(key: keyof typeof envSchema.shape) {
  const value = process.env[key];
  if (value === undefined || value === '') {
    throw new Error(`Variável de ambiente "${key}" não está definida.`);
  }
  return value;
}
