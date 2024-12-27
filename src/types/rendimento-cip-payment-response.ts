export interface RendimentoCIPPaymentResponse {
  cliente: string
  documento: string
  codigoBanco: string
  agencia: string
  conta: string
  transacaoId: string
  dataPagamento: string
  valorPago: number
  codigoControleCliente: string
  status: string
  tipoTransacao: string
  produto: string
  detalhesComprovante: {
    favorecido: string
    codigoDeBarras: string
    linhaDigitavel: string
    dataEfetivacao: string | null
    valorEfetivado: number | null
    autenticacao: string | null
    nsu: string | null
  }
}