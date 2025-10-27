import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base URL for API
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Gift Card Types
export interface GiftCard {
  id: string;
  code: string;
  originalAmount: number;
  currentBalance: number;
  currency: string;
  status: 'active' | 'redeemed' | 'expired' | 'cancelled';
  message?: string;
  recipientName?: string;
  recipientEmail?: string;
  expiresAt?: string;
  redeemedAt?: string;
  purchasedAt: string;
  updatedAt: string;
  purchaserId: string;
  recipientId?: string;
  usageHistory?: GiftCardUsage[];
}

export interface GiftCardUsage {
  id: string;
  amountUsed: number;
  remainingBalance: number;
  usedAt: string;
  usedInBookingId?: string;
  description?: string;
  giftCardId: string;
}

export interface CreateGiftCardRequest {
  amount: number;
  recipientName?: string;
  recipientEmail?: string;
  message?: string;
  expiresAt?: string;
}

export interface RedeemGiftCardRequest {
  code: string;
  amount: number;
  bookingId?: string;
  description?: string;
}

export interface GiftCardBalanceRequest {
  code: string;
}

export interface GiftCardBalanceResponse {
  balance: number;
  status: string;
  expiresAt: string;
}

export interface TransferGiftCardRequest {
  recipientEmail: string;
}

export interface CancelGiftCardRequest {
  reason?: string;
}

// Gift Card Statistics
export interface GiftCardStats {
  totalSales: number;
  totalRedeemed: number;
  activeCards: number;
  totalValue: number;
  monthlyGrowth: number;
}

export const giftCardsApi = createApi({
  reducerPath: 'giftCardsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/gift-cards`,
    prepareHeaders: (headers, { getState }) => {
      // Add auth token from state
      const token = (getState() as any).auth?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['GiftCard', 'GiftCardStats'],
  endpoints: (builder) => ({
    // Create Gift Card
    createGiftCard: builder.mutation<GiftCard, CreateGiftCardRequest>({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['GiftCard', 'GiftCardStats'],
    }),

    // Get User's Gift Cards
    getMyGiftCards: builder.query<GiftCard[], void>({
      query: () => '/my-cards',
      providesTags: ['GiftCard'],
    }),

    // Get Active Gift Cards
    getActiveGiftCards: builder.query<GiftCard[], void>({
      query: () => '/active',
      providesTags: ['GiftCard'],
    }),

    // Check Gift Card Balance
    checkGiftCardBalance: builder.mutation<GiftCardBalanceResponse, GiftCardBalanceRequest>({
      query: (data) => ({
        url: '/check-balance',
        method: 'POST',
        body: data,
      }),
    }),

    // Redeem Gift Card
    redeemGiftCard: builder.mutation<GiftCard, RedeemGiftCardRequest>({
      query: (data) => ({
        url: '/redeem',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['GiftCard', 'GiftCardStats'],
    }),

    // Get Gift Card by Code
    getGiftCardByCode: builder.query<GiftCard, string>({
      query: (code) => `/${code}`,
      providesTags: (result, error, code) => [{ type: 'GiftCard', id: code }],
    }),

    // Get Gift Card Usage History
    getGiftCardUsageHistory: builder.query<GiftCardUsage[], string>({
      query: (code) => `/${code}/usage-history`,
      providesTags: (result, error, code) => [{ type: 'GiftCard', id: `${code}-history` }],
    }),

    // Transfer Gift Card
    transferGiftCard: builder.mutation<GiftCard, { code: string; data: TransferGiftCardRequest }>({
      query: ({ code, data }) => ({
        url: `/${code}/transfer`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { code }) => [
        { type: 'GiftCard', id: code },
        'GiftCard',
      ],
    }),

    // Cancel Gift Card
    cancelGiftCard: builder.mutation<GiftCard, { code: string; data?: CancelGiftCardRequest }>({
      query: ({ code, data }) => ({
        url: `/${code}`,
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: (result, error, { code }) => [
        { type: 'GiftCard', id: code },
        'GiftCard',
        'GiftCardStats',
      ],
    }),

    // Admin: Get Gift Card Statistics
    getGiftCardStats: builder.query<GiftCardStats, void>({
      query: () => '/admin/stats',
      providesTags: ['GiftCardStats'],
    }),

    // Admin: Get All Gift Cards
    getAllGiftCards: builder.query<{ giftCards: GiftCard[]; total: number; page: number; limit: number }, {
      page?: number;
      limit?: number;
      status?: string;
      search?: string;
    }>({
      query: ({ page = 1, limit = 10, status, search }) => ({
        url: '/admin/all',
        params: { page, limit, status, search },
      }),
      providesTags: ['GiftCard'],
    }),

    // Provider: Get Gift Card Sales
    getProviderGiftCardSales: builder.query<{ sales: GiftCard[]; stats: any }, {
      providerId: string;
      page?: number;
      limit?: number;
    }>({
      query: ({ providerId, page = 1, limit = 10 }) => ({
        url: `/provider/${providerId}/sales`,
        params: { page, limit },
      }),
      providesTags: ['GiftCard', 'GiftCardStats'],
    }),
  }),
});

export const {
  // Customer mutations
  useCreateGiftCardMutation,
  useCheckGiftCardBalanceMutation,
  useRedeemGiftCardMutation,
  useTransferGiftCardMutation,
  useCancelGiftCardMutation,

  // Customer queries
  useGetMyGiftCardsQuery,
  useGetActiveGiftCardsQuery,
  useGetGiftCardByCodeQuery,
  useGetGiftCardUsageHistoryQuery,

  // Admin queries
  useGetGiftCardStatsQuery,
  useGetAllGiftCardsQuery,

  // Provider queries
  useGetProviderGiftCardSalesQuery,
} = giftCardsApi;