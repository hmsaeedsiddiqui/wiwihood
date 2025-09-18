import axios from 'axios';

export async function createStripeCheckoutSession({ amount, currency = 'usd', description = 'Payment', successUrl, cancelUrl }) {
  const response = await axios.post('/api/payment/create-checkout-session', {
    amount,
    currency,
    description,
    successUrl,
    cancelUrl,
  });
  return response.data.url;
}
