type BarcodeType = 
  | 'BANCO'
  | 'CARTAO_DE_CREDITO'
  | 'ARRECADACAO_PREFEITURA'
  | 'CONVENIO_SANEAMENTO'
  | 'CONVENIO_ENERGIA_ELETRICA_E_GAS'
  | 'CONVENIO_TELECOMUNICACOES'
  | 'ARRECADACAO_ORGAOS_GOVERNAMENTAIS'
  | 'OUTROS'
  | 'ARRECADACAO_TAXAS_DE_TRANSITO';

export default class BarcodeGenerator {
  static generateBarcode(tipo: BarcodeType): string {
    let barcode = '001'; // Código do Banco do Brasil
    for (let i = 3; i < 44; i++) { // Preenche a partir do índice 3
      barcode += Math.floor(Math.random() * 10).toString();
    }

    const checksum = this.calculateChecksum(barcode);
    barcode += checksum;

    switch (tipo) {
      case 'BANCO':
        return barcode;
      case 'CARTAO_DE_CREDITO':
        return barcode;
      case 'ARRECADACAO_PREFEITURA':
        return '9' + barcode + '1';
      case 'CONVENIO_SANEAMENTO':
        return '7' + barcode + '3';
      case 'CONVENIO_ENERGIA_ELETRICA_E_GAS':
        return '5' + barcode + '9';
      case 'CONVENIO_TELECOMUNICACOES':
        return '3' + barcode + '7';
      case 'ARRECADACAO_ORGAOS_GOVERNAMENTAIS':
        return '1' + barcode + '5';
      case 'OUTROS':
        return '6' + barcode + '2';
      case 'ARRECADACAO_TAXAS_DE_TRANSITO':
        return '4' + barcode + '8';
      default:
        throw new Error('Tipo de código de barras desconhecido: ' + tipo);
    }
  }

  private static calculateChecksum(barcode: string): string {
    const mod = barcode.length % 10;
    return (10 - mod).toString();
  }
}
