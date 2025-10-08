import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from '../services/payment.service';

@Controller('api/payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-checkout-session')
  async createCheckoutSession(@Body() body: {
    amount: number;
    currency?: string;
    description?: string;
    successUrl: string;
    cancelUrl: string;
  }) {
    const url = await this.paymentService.createCheckoutSession(body);
    return { url };
  }
}
