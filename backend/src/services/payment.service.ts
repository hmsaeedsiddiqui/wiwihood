import Stripe from 'stripe';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-09-30.clover',
    });
  }

  async createCheckoutSession({
    amount,
    currency = 'usd',
    successUrl,
    cancelUrl,
    description = 'Payment',
  }: {
    amount: number;
    currency?: string;
    successUrl: string;
    cancelUrl: string;
    description?: string;
  }) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: description,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
    return session.url;
  }
}
