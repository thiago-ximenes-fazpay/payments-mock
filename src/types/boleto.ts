export type BoletoStatus = 'pending' | 'paid' | 'cancelled';

export interface Boleto {
  id: string;
  code: string;
  amount: number;
  dueDate: string;
  status: BoletoStatus;
  createdAt: string;
}

export type CreateBoletoInput = Omit<Boleto, 'id' | 'createdAt' | 'status'>;
