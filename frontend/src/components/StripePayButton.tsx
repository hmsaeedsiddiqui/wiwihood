import { createStripeCheckoutSession } from '../lib/stripe';
type StripePayButtonProps = {
  amount: number;
};

export default function StripePayButton({ amount }: StripePayButtonProps) {
  const handlePay = async () => {
    const successUrl = window.location.origin + '/cart?payment=success';
    const cancelUrl = window.location.origin + '/cart?payment=cancel';
    const url = await createStripeCheckoutSession({
      amount,
      successUrl,
      cancelUrl,
    });
    window.location.href = url;
  };

  return (
    <button onClick={handlePay} className="bg-blue-600 text-white px-4 py-2 rounded">
      Pay with Stripe
    </button>
  );
}
