import axios from 'axios';

export async function createStripeCheckoutSession({ amount, currency = 'usd', description = 'Payment', successUrl, cancelUrl }) {
  const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const response = await axios.post(`${baseURL}/api/payment/create-checkout-session`, {
    amount,
    currency,
    description,
    successUrl,
    cancelUrl,
  });
  return response.data.url;
}
