import { inject } from '@adonisjs/core';
import CheckPaymentSlipLineRendimentoService from '#services/rendimento/payment_slip/check_payment_slip_line_rendimento_service';
import { PaymentSlipCheckData } from '../../schemas/common.js';

@inject()
export default class CheckPaymentSlipLineService {
  constructor(
    private readonly checkPaymentSlipLineService: CheckPaymentSlipLineRendimentoService
  ) {}

  async handle(line: string): Promise<PaymentSlipCheckData> {
    if (line.length === 44) {
      line = this.convertCodeToLine(line);
    }
    const result = await this.checkPaymentSlipLineService.handle(line);

    // Additional logic to process the result

    return result;
  }

  convertCodeToLine(codigo: string): string {
    // Placeholder for the refactored convertCodeToLine logic
    return codigo;
  }
}
