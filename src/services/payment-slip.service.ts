export default class CheckPaymentSlipLineService {
  constructor(
    private readonly checkPaymentSlipLineService: CheckPaymentSlipLineRendimentoService
  ) {}

  async handle(line: string): Promise<PaymentSlipCheckData> {
    if (line.length === 44) {
      line = this.convertCodeToLine(line)
    }
    const result = await this.checkPaymentSlipLineService.handle(line)

    const bankCode = line.charAt(0) === '8' ? '0' : line.substring(0, 3)

    const bank = await Bank.query().where('compe', bankCode).first()

    return {
      amount: result.valorTotal,
      digitalLine: result.linhaDigitavel?.replace('-', '').replace(' ', ''),
      barCode: result.codigoDeBarras?.replace('-', '').replace(' ', ''),
      bankCode: bankCode,
      bankName: bank?.shortName,
      beneficiaryName: result.nomeBeneficiario,
      beneficiaryDocument: result.cnpjcpfBeneficiario,
      payeeName: result.nomePagador,
      dueDate: result.dataVencimento,
      documentAmount: result.valor,
      moraAmount: result.multa,
      discountsAmount: result.desconto,
      fineAmount: result.juros,
      hasPaymentForThisLine: false,
    }
  }

  convertCodeToLine(codigo: string): string {
    // Clean the input by removing non-numeric characters
    codigo = codigo.replace(/[^0-9]/g, '');

    // Validate the cleaned input
    if (codigo.length < 10) {
      throw new Error('Código inválido: deve ter pelo menos 10 dígitos.');
    }

    // Identify the type of payment slip
    const tipoBoleto = this.identificarTipoBoleto(codigo);

    // Handle conversion based on the type
    switch (tipoBoleto) {
      case 'BANCO':
        return this.handleBanco(codigo);
      case 'CARTAO_DE_CREDITO':
        return this.handleCartaoCredito(codigo);
      default:
        throw new Error('Tipo de boleto desconhecido: ' + tipoBoleto);
    }
  }

  private handleBanco(codigo: string): string {
    const novaLinha =
      codigo.substr(0, 4) + codigo.substr(19, 25) + codigo.substr(4, 1) + codigo.substr(5, 14);

    return this.formatBancoLine(novaLinha);
  }

  private handleCartaoCredito(codigo: string): string {
    const identificacaoValorRealOuReferencia = this.identificarReferencia(codigo);
    let resultado = '';

    if (identificacaoValorRealOuReferencia.mod === 10) {
      resultado = this.formatCartaoCreditoLine(codigo, this.calculaMod10);
    } else if (identificacaoValorRealOuReferencia.mod === 11) {
      resultado = this.formatCartaoCreditoLine(codigo, this.calculaMod11);
    }

    return resultado;
  }

  private formatBancoLine(novaLinha: string): string {
    const bloco1 = novaLinha.substr(0, 9) + this.calculaMod10(novaLinha.substr(0, 9));
    const bloco2 = novaLinha.substr(9, 10) + this.calculaMod10(novaLinha.substr(9, 10));
    const bloco3 = novaLinha.substr(19, 10) + this.calculaMod10(novaLinha.substr(19, 10));
    const bloco4 = novaLinha.substr(29);

    return bloco1 + bloco2 + bloco3 + bloco4;
  }

  private formatCartaoCreditoLine(codigo: string, calculaMod: (numero: string) => number): string {
    const bloco1 = codigo.substr(0, 11) + calculaMod(codigo.substr(0, 11));
    const bloco2 = codigo.substr(11, 11) + calculaMod(codigo.substr(11, 11));
    const bloco3 = codigo.substr(22, 11) + calculaMod(codigo.substr(22, 11));
    const bloco4 = codigo.substr(33, 11) + calculaMod(codigo.substr(33, 11));

    return bloco1 + bloco2 + bloco3 + bloco4;
  }

  private calculaMod10 = (numero: any) => {
    numero = numero.replace(/\D/g, '')
    var i
    var mult = 2
    var soma = 0
    var s = ''

    for (i = numero.length - 1; i >= 0; i--) {
      s = mult * Number.parseInt(numero.charAt(i)) + s
      if (--mult < 1) {
        mult = 2
      }
    }
    for (i = 0; i < s.length; i++) {
      soma = soma + Number.parseInt(s.charAt(i))
    }
    soma = soma % 10
    if (soma !== 0) {
      soma = 10 - soma
    }
    return soma
  }

  private calculaMod11 = (x: any) => {
    let sequencia = [4, 3, 2, 9, 8, 7, 6, 5]
    let digit = 0
    let j = 0
    let DAC = 0

    //FEBRABAN https://cmsportal.febraban.org.br/Arquivos/documentos/PDF/Layout%20-%20C%C3%B3digo%20de%20Barras%20-%20Vers%C3%A3o%205%20-%2001_08_2016.pdf
    for (var i = 0; i < x.length; i++) {
      let mult = sequencia[j]
      j++
      j %= sequencia.length
      digit += mult * Number.parseInt(x.charAt(i))
    }

    DAC = digit % 11

    if (DAC === 0 || DAC === 1) return 0
    if (DAC === 10) return 1

    return 11 - DAC
  }

  private identificarReferencia = (codigo: any) => {
    codigo = codigo.replace(/[^0-9]/g, '')

    const referencia = codigo.substr(2, 1)

    if (typeof codigo !== 'string') throw new TypeError('Insira uma string válida!')

    switch (referencia) {
      case '6':
        return {
          mod: 10,
          efetivo: true,
        }
      case '7':
        return {
          mod: 10,
          efetivo: false,
        }
      case '8':
        return {
          mod: 11,
          efetivo: true,
        }
      case '9':
        return {
          mod: 11,
          efetivo: false,
        }
      default:
        break
    }
  }

  private identificarTipoBoleto = (codigo: any, tipoEscolhido?: string) => {
    codigo = codigo.replace(/[^0-9]/g, '');

    if (typeof codigo !== 'string') throw new TypeError('Insira uma string válida!');

    // If a type is chosen, return it directly
    if (tipoEscolhido) {
      return tipoEscolhido;
    }

    // Existing logic to determine the type if none is chosen
    if (codigo.substr(-14) === '00000000000000' || codigo.substr(5, 14) === '00000000000000') {
      return 'CARTAO_DE_CREDITO';
    } else if (codigo.substr(0, 1) === '8') {
      if (codigo.substr(1, 1) === '1') {
        return 'ARRECADACAO_PREFEITURA';
      } else if (codigo.substr(1, 1) === '2') {
        return 'CONVENIO_SANEAMENTO';
      } else if (codigo.substr(1, 1) === '3') {
        return 'CONVENIO_ENERGIA_ELETRICA_E_GAS';
      } else if (codigo.substr(1, 1) === '4') {
        return 'CONVENIO_TELECOMUNICACOES';
      } else if (codigo.substr(1, 1) === '5') {
        return 'ARRECADACAO_ORGAOS_GOVERNAMENTAIS';
      } else if (codigo.substr(1, 1) === '6' || codigo.substr(1, 1) === '9') {
        return 'OUTROS';
      } else if (codigo.substr(1, 1) === '7') {
        return 'ARRECADACAO_TAXAS_DE_TRANSITO';
      }
    } else {
      return 'BANCO';
    }
  }
}
