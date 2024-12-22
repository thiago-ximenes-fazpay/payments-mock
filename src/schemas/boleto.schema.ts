import { z } from 'zod';
import { DateTime } from 'luxon';

export const boletoSchema = z.object({
  code: z.string()
    .min(1, 'O código do boleto é obrigatório')
    .length(47, 'O código do boleto deve ter 47 dígitos')
    .regex(/^\d+$/, 'O código do boleto deve conter apenas números'),
  amount: z.number()
    .min(0.01, 'O valor deve ser maior que zero')
    .max(999999.99, 'O valor máximo permitido é R$ 999.999,99'),
  dueDate: z.string()
    .refine((date) => {
      try {
        const parsedDate = DateTime.fromISO(date);
        return parsedDate.isValid;
      } catch {
        return false;
      }
    }, 'Data inválida')
    .refine((date) => {
      const today = DateTime.now().startOf('day');
      const dueDate = DateTime.fromISO(date).startOf('day');
      return dueDate >= today;
    }, 'A data de vencimento deve ser igual ou posterior a hoje'),
  createdAt: z.string().optional(),
});

export type BoletoFormData = z.infer<typeof boletoSchema>;
