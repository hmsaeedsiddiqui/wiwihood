import Stripe from 'stripe';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentService {
  private stripe?: Stripe;

  constructor() {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (stripeKey) {
      this.stripe = new Stripe(stripeKey, {
        apiVersion: '2025-09-30.clover',
      });
    } else {
      console.warn('⚠️  STRIPE_SECRET_KEY not found - payment features disabled');
    }
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
    if (!this.stripe) {
      throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
    }
    
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
