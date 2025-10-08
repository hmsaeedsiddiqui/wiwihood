import { Controller, Post, Body, Headers, RawBody, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StripeService } from './stripe.service';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@ApiTags('Stripe Payments')
@ApiBearerAuth()
@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @ApiOperation({ summary: 'Create payment intent' })
  @ApiResponse({ status: 201, description: 'Payment intent created successfully' })
  @Post('payment-intent')
  async createPaymentIntent(@Body() createPaymentIntentDto: CreatePaymentIntentDto) {
    return this.stripeService.createPaymentIntent(createPaymentIntentDto);
  }

  @ApiOperation({ summary: 'Create Stripe customer' })
  @ApiResponse({ status: 201, description: 'Customer created successfully' })
  @Post('customer')
  async createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    return this.stripeService.createCustomer(createCustomerDto);
  }

  @ApiOperation({ summary: 'Create subscription' })
  @ApiResponse({ status: 201, description: 'Subscription created successfully' })
  @Post('subscription')
  async createSubscription(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.stripeService.createSubscription(createSubscriptionDto);
  }

  @ApiOperation({ summary: 'Handle Stripe webhooks' })
  @HttpCode(HttpStatus.OK)
  @Post('webhook')
  async handleWebhook(
    @RawBody() payload: string,
    @Headers('stripe-signature') signature: string,
  ) {
    const event = this.stripeService.constructWebhookEvent(payload, signature);

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.stripeService.handleSuccessfulPayment(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await this.stripeService.handleFailedPayment(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return { received: true };
  }
}