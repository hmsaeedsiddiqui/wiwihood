import { createStripeCheckoutSession } from '../lib/stripe';
type StripePayButtonProps = {
  amount: number;
};

export default function StripePayButton({ amount }: StripePayButtonProps) {
  const handlePay = async () => {
    const successUrl = window.location.origin + `/payment-success?amount=${(amount / 100).toFixed(2)}&method=stripe`;
    const cancelUrl = window.location.origin + '/cart?payment=cancel';
    const url = await createStripeCheckoutSession({
      amount,
      successUrl,
      cancelUrl,
    });
    window.location.href = url;
  };

  return (
    <button 
      onClick={handlePay} 
      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
      <span>Secure Checkout - ${(amount / 100).toFixed(2)}</span>
    </button>
  );
}
