import { registerAs } from '@nestjs/config';

export default registerAs('stripe', () => ({
  secretKey: process.env.STRIPE_SECRET_KEY,
  publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  currency: process.env.STRIPE_CURRENCY || 'usd',
  successUrl: process.env.STRIPE_SUCCESS_URL || `${process.env.FRONTEND_URL}/payment/success`,
  cancelUrl: process.env.STRIPE_CANCEL_URL || `${process.env.FRONTEND_URL}/payment/cancel`,
}));