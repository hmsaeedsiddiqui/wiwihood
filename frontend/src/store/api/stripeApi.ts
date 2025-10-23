import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base URL configuration
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Stripe interfaces
export interface CreatePaymentIntentData {
  amount: number;
  currency?: string;
  serviceId: string;
  providerId: string;
  bookingId?: string;
  customerEmail?: string;
  customerName?: string;
  description?: string;
  metadata?: Record<string, string>;
}

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: string;
  created: number;
  description?: string;
  metadata?: Record<string, any>;
}

export interface CreateCustomerData {
  email: string;
  name?: string;
  phone?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
  metadata?: Record<string, string>;
}

export interface StripeCustomer {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  created: number;
  metadata?: Record<string, any>;
}

export interface CreateSubscriptionData {
  customerId: string;
  priceId: string;
  paymentMethodId?: string;
  metadata?: Record<string, string>;
}

export interface Subscription {
  id: string;
  customerId: string;
  status: string;
  currentPeriodStart: number;
  currentPeriodEnd: number;
  created: number;
  metadata?: Record<string, any>;
}

export interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
  created: number;
}

export interface WebhookEvent {
  id: string;
  type: string;
  data: {
    object: any;
  };
  created: number;
}

export const stripeApi = createApi({
  reducerPath: 'stripeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/stripe`,
    prepareHeaders: (headers) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken') || 
                     localStorage.getItem('auth-token') || 
                     localStorage.getItem('adminToken') || 
                     localStorage.getItem('providerToken');
        
        if (token) {
          headers.set('authorization', `Bearer ${token}`);
        }
      }
      
      headers.set('content-type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['PaymentIntent', 'Customer', 'Subscription', 'PaymentMethod'],
  endpoints: (builder) => ({
    // Create payment intent
    createPaymentIntent: builder.mutation<PaymentIntent, CreatePaymentIntentData>({
      query: (paymentData) => ({
        url: '/payment-intent',
        method: 'POST',
        body: paymentData,
      }),
      invalidatesTags: ['PaymentIntent'],
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to create payment intent',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      })
    }),

    // Get payment intent by ID
    getPaymentIntent: builder.query<PaymentIntent, string>({
      query: (id) => ({
        url: `/payment-intent/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'PaymentIntent', id }],
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to get payment intent',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      })
    }),

    // Update payment intent
    updatePaymentIntent: builder.mutation<PaymentIntent, { id: string; data: Partial<CreatePaymentIntentData> }>({
      query: ({ id, data }) => ({
        url: `/payment-intent/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'PaymentIntent', id },
      ],
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to update payment intent',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      })
    }),

    // Cancel payment intent
    cancelPaymentIntent: builder.mutation<PaymentIntent, string>({
      query: (id) => ({
        url: `/payment-intent/${id}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'PaymentIntent', id },
      ],
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to cancel payment intent',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      })
    }),

    // Create customer
    createCustomer: builder.mutation<StripeCustomer, CreateCustomerData>({
      query: (customerData) => ({
        url: '/customer',
        method: 'POST',
        body: customerData,
      }),
      invalidatesTags: ['Customer'],
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to create customer',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      })
    }),

    // Get customer by ID
    getCustomer: builder.query<StripeCustomer, string>({
      query: (id) => ({
        url: `/customer/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Customer', id }],
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to get customer',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      })
    }),

    // Update customer
    updateCustomer: builder.mutation<StripeCustomer, { id: string; data: Partial<CreateCustomerData> }>({
      query: ({ id, data }) => ({
        url: `/customer/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Customer', id },
      ],
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to update customer',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      })
    }),

    // Delete customer
    deleteCustomer: builder.mutation<void, string>({
      query: (id) => ({
        url: `/customer/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Customer', id },
      ],
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to delete customer',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      })
    }),

    // Create subscription
    createSubscription: builder.mutation<Subscription, CreateSubscriptionData>({
      query: (subscriptionData) => ({
        url: '/subscription',
        method: 'POST',
        body: subscriptionData,
      }),
      invalidatesTags: ['Subscription'],
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to create subscription',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      })
    }),

    // Get subscription by ID
    getSubscription: builder.query<Subscription, string>({
      query: (id) => ({
        url: `/subscription/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Subscription', id }],
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to get subscription',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      })
    }),

    // Cancel subscription
    cancelSubscription: builder.mutation<Subscription, string>({
      query: (id) => ({
        url: `/subscription/${id}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Subscription', id },
      ],
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to cancel subscription',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      })
    }),

    // Handle webhook events (for internal use)
    handleWebhook: builder.mutation<{ received: boolean }, WebhookEvent>({
      query: (eventData) => ({
        url: '/webhook',
        method: 'POST',
        body: eventData,
      }),
      transformErrorResponse: (response: any) => ({
        message: response?.data?.message || 'Failed to handle webhook',
        statusCode: typeof response.status === 'number' ? response.status : 500,
        error: response?.data?.error
      })
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useCreatePaymentIntentMutation,
  useGetPaymentIntentQuery,
  useUpdatePaymentIntentMutation,
  useCancelPaymentIntentMutation,
  useCreateCustomerMutation,
  useGetCustomerQuery,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useCreateSubscriptionMutation,
  useGetSubscriptionQuery,
  useCancelSubscriptionMutation,
  useHandleWebhookMutation,
} = stripeApi;

export default stripeApi;