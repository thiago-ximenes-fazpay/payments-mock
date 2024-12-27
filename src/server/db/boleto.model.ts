import { BoletoStatus } from '@/types/boleto';
import mongoose, { Document, Schema } from 'mongoose';

export interface IBoleto extends Document {
  cnpjcpfBeneficiario: string | null;
  cnpjcpfPagador: string | null;
  codigoDeBarras: string;
  linhaDigitavel: string;
  motivo: string | null;
  nomeBeneficiario: string | null;
  nomePagador: string | null;
  permiteAlterarValorTotal: boolean | null;
  permitePagamentoParcial: boolean | null;
  razaoSocialBeneficiario: string | null;
  tipoAutorizacaoRecebimentoValorDivergente: string | null;
  tipoPagamentoDiverso: string | null;
  validarDuplicidade: boolean | null;
  valorDesconto: number | null;
  desconto: number | null;
  valorAbatimento: number | null;
  juros: number | null;
  multa: number | null;
  valor: number;
  valorMaximo: number | null;
  valorMinimo: number | null;
  valorTotal: number | null;
  dataVencimento: string;
  dataLimitePagamento: string | null;
  habilitaMP: boolean | null;
  dataHoraConsultaBoleto: string | null;
  sacadorAvalista: {
    tipoPessoa: string | null;
    inscricaoNacional: string | null;
    nome: string | null;
  } | null;
  erroMessage: {
    statusCode: number | null;
    message: string | null;
    errors: any[] | null;
  } | null;
  isSuccess: boolean | null;
  isFailure: boolean | null;
  status: BoletoStatus;
}

const BoletoSchema: Schema = new Schema({
  cnpjcpfBeneficiario: { type: String, default: null },
  cnpjcpfPagador: { type: String, default: null },
  codigoDeBarras: { type: String, required: true },
  linhaDigitavel: { type: String, required: true },
  motivo: { type: String, default: null },
  nomeBeneficiario: { type: String, default: null },
  nomePagador: { type: String, default: null },
  permiteAlterarValorTotal: { type: Boolean, default: null },
  permitePagamentoParcial: { type: Boolean, default: null },
  razaoSocialBeneficiario: { type: String, default: null },
  tipoAutorizacaoRecebimentoValorDivergente: { type: String, default: null },
  tipoPagamentoDiverso: { type: String, default: null },
  validarDuplicidade: { type: Boolean, default: null },
  valorDesconto: { type: Number, default: null },
  desconto: { type: Number, default: null },
  valorAbatimento: { type: Number, default: null },
  juros: { type: Number, default: null },
  multa: { type: Number, default: null },
  valor: { type: Number, required: true },
  valorMaximo: { type: Number, default: null },
  valorMinimo: { type: Number, default: null },
  valorTotal: { type: Number, default: null },
  dataVencimento: { type: String, required: true },
  dataLimitePagamento: { type: String, default: null },
  habilitaMP: { type: Boolean, default: null },
  dataHoraConsultaBoleto: { type: String, default: null },
  sacadorAvalista: {
    tipoPessoa: { type: String, default: null },
    inscricaoNacional: { type: String, default: null },
    nome: { type: String, default: null },
  },
  erroMessage: {
    statusCode: { type: Number, default: null },
    message: { type: String, default: null },
    errors: { type: Array, default: null },
  },
  isSuccess: { type: Boolean, default: null },
  isFailure: { type: Boolean, default: null },
  status: { type: String, required: true },
});

const Boleto = (mongoose.models?.Boleto || mongoose.model<IBoleto>('Boleto', BoletoSchema)) as mongoose.Model<IBoleto>;

export default Boleto;
