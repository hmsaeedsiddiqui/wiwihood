import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const Stripe = require('stripe');
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private stripe: any;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get('stripe.secretKey'), {
      apiVersion: '2023-10-16',
    });
  }

  // Create Payment Intent for one-time payments
  async createPaymentIntent(createPaymentIntentDto: CreatePaymentIntentDto) {
    try {
      const { amount, currency, customerId, metadata } = createPaymentIntentDto;
      
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency || 'usd',
        customer: customerId,
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      this.logger.error('Failed to create payment intent', error);
      throw error;
    }
  }

  // Create Stripe Customer
  async createCustomer(createCustomerDto: CreateCustomerDto) {
    try {
      const { email, name, phone, metadata } = createCustomerDto;
      
      const customer = await this.stripe.customers.create({
        email,
        name,
        phone,
        metadata,
      });

      return customer;
    } catch (error) {
      this.logger.error('Failed to create customer', error);
      throw error;
    }
  }

  // Create Subscription for recurring payments
  async createSubscription(createSubscriptionDto: CreateSubscriptionDto) {
    try {
      const { customerId, priceId, metadata } = createSubscriptionDto;
      
      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        metadata,
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      });

      return subscription;
    } catch (error) {
      this.logger.error('Failed to create subscription', error);
      throw error;
    }
  }

  // Retrieve Payment Intent
  async retrievePaymentIntent(paymentIntentId: string) {
    try {
      return await this.stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      this.logger.error('Failed to retrieve payment intent', error);
      throw error;
    }
  }

  // Create Refund
  async createRefund(paymentIntentId: string, amount?: number) {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined,
      });

      return refund;
    } catch (error) {
      this.logger.error('Failed to create refund', error);
      throw error;
    }
  }

  // Construct webhook event
  constructWebhookEvent(payload: string, signature: string) {
    try {
      const webhookSecret = this.configService.get('stripe.webhookSecret');
      return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (error) {
      this.logger.error('Failed to construct webhook event', error);
      throw error;
    }
  }

  // Handle successful payment
  async handleSuccessfulPayment(paymentIntent: any) {
    this.logger.log(`Payment succeeded: ${paymentIntent.id}`);
    // Add your business logic here
    return { success: true, paymentIntentId: paymentIntent.id };
  }

  // Handle failed payment
  async handleFailedPayment(paymentIntent: any) {
    this.logger.error(`Payment failed: ${paymentIntent.id}`);
    // Add your business logic here
    return { success: false, paymentIntentId: paymentIntent.id };
  }
}