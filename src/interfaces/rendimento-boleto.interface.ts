import { BoletoStatus } from "@/types/boleto"

export interface RendimentoBoletoResponse {
  cnpjcpfBeneficiario: string | null
  cnpjcpfPagador: string | null
  codigoDeBarras: string
  linhaDigitavel: string
  motivo: string | null
  nomeBeneficiario: string | null
  nomePagador: string | null
  permiteAlterarValorTotal: boolean | null
  permitePagamentoParcial: boolean | null
  razaoSocialBeneficiario: string | null
  tipoAutorizacaoRecebimentoValorDivergente: string | null
  tipoPagamentoDiverso: string | null
  validarDuplicidade: boolean | null
  valorDesconto: number | null
  desconto: number | null
  valorAbatimento: number | null
  juros: number | null
  multa: number | null
  valor: number
  valorMaximo: number | null
  valorMinimo: number | null
  valorTotal: number | null
  dataVencimento: string
  dataLimitePagamento: string | null
  habilitaMP: boolean | null
  dataHoraConsultaBoleto: string | null
  sacadorAvalista: {
    tipoPessoa: string | null
    inscricaoNacional: string | null
    nome: string | null
  } | null
  erroMessage: {
    statusCode: number | null
    message: string | null
    errors: any[] | null
  } | null
  isSuccess: boolean | null
  isFailure: boolean | null
  status: BoletoStatus
}