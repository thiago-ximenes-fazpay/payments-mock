import { cache } from "react";

interface Boleto {
  id: string;
  // Adicione outras propriedades do boleto conforme necessário
}

class BoletoSingleton {
  private static instance: BoletoSingleton;
  private boletos: { [key: string]: Boleto } = {};

  private constructor() {}

  public static getInstance(): BoletoSingleton {
    if (!BoletoSingleton.instance) {
      BoletoSingleton.instance = new BoletoSingleton();
    }
    return BoletoSingleton.instance;
  }

  public addBoleto(boleto: any) {
    this.boletos = cache(
      () => ({
        ...this.boletos,
        [boleto.line]: boleto
      })
    )()
  }

  public getBoleto(line: string): any | undefined {
    return this.boletos[line];
  }

  public getAllBoletos(): any[] {
    return Object.values(this.boletos);
  }

  public removeBoleto(line: string) {
    delete this.boletos[line];
  }
}

const boletos = BoletoSingleton.getInstance();

export default boletos;
