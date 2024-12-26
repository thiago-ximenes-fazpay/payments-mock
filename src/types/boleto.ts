import { RendimentoBoletoResponse } from "@/interfaces/rendimento-boleto.interface";

export type BoletoStatus = 'pending' | 'paid' | 'cancelled';

export type CreateBoletoInput = Omit<RendimentoBoletoResponse, 'id' | 'createdAt' | 'status'>;
