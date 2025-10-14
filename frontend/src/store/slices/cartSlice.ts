import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

// Cart item interface
export interface CartItem {
  id: string
  name: string
  provider: string
  price: number
  imageUrl: string
  quantity: number
}

// Cart state interface
interface CartState {
  items: CartItem[]
  isLoading: boolean
  isUpdating: boolean
  error: string | null
  totalPrice: number
  totalItems: number
}

// Initial state
const initialState: CartState = {
  items: [],
  isLoading: false,
  isUpdating: false,
  error: null,
  totalPrice: 0,
  totalItems: 0,
}

// Helper function to get auth headers
const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth-token') || 
                 localStorage.getItem('accessToken') ||
                 localStorage.getItem('customerToken') ||
                 localStorage.getItem('providerToken')
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }
  
  return headers
}

// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        if (response.status === 404) {
          // Empty cart is not an error
          return []
        }
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to fetch cart')
      }

      const data = await response.json()
      
      // Transform backend cart items to frontend format
      const transformedCart = Array.isArray(data) ? data.map((item: any) => ({
        id: item.id,
        name: item.service?.name || 'Unknown Service',
        provider: item.service?.provider?.businessName || 'Unknown Provider',
        price: item.service?.basePrice || 0,
        imageUrl: item.service?.images?.[0] || '/blog1.jpg',
        quantity: item.quantity,
      })) : []
      
      return transformedCart
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error')
    }
  }
)

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (item: CartItem, { getState, rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ 
          serviceId: item.id, 
          quantity: item.quantity 
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to add to cart')
      }

      return item
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error')
    }
  }
)

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to remove from cart')
      }

      return itemId
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error')
    }
  }
)

export const updateCartQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async ({ itemId, quantity }: { itemId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ quantity }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to update quantity')
      }

      return { itemId, quantity }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error')
    }
  }
)

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to clear cart')
      }

      return null
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error')
    }
  }
)

// Helper functions to calculate totals
const calculateTotals = (items: CartItem[]) => {
  const totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0)
  const totalItems = items.reduce((total, item) => total + item.quantity, 0)
  return { totalPrice, totalItems }
}

// Cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    // Optimistic updates for better UX
    optimisticallyAddItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      if (existingItem) {
        existingItem.quantity += action.payload.quantity
      } else {
        state.items.push(action.payload)
      }
      const totals = calculateTotals(state.items)
      state.totalPrice = totals.totalPrice
      state.totalItems = totals.totalItems
    },
    optimisticallyRemoveItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload)
      const totals = calculateTotals(state.items)
      state.totalPrice = totals.totalPrice
      state.totalItems = totals.totalItems
    },
    optimisticallyUpdateQuantity: (state, action: PayloadAction<{ itemId: string; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.itemId)
      if (item) {
        item.quantity = action.payload.quantity
      }
      const totals = calculateTotals(state.items)
      state.totalPrice = totals.totalPrice
      state.totalItems = totals.totalItems
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart cases
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
        const totals = calculateTotals(state.items)
        state.totalPrice = totals.totalPrice
        state.totalItems = totals.totalItems
        state.error = null
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // Add to cart cases
      .addCase(addToCart.pending, (state) => {
        state.isUpdating = true
        state.error = null
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isUpdating = false
        // Item was already optimistically added, just confirm success
        state.error = null
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isUpdating = false
        state.error = action.payload as string
        // Note: We might want to revert optimistic update here
        // by refetching the cart or removing the optimistically added item
      })
      
      // Remove from cart cases
      .addCase(removeFromCart.pending, (state) => {
        state.isUpdating = true
        state.error = null
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.isUpdating = false
        // Item was already optimistically removed, just confirm success
        state.error = null
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isUpdating = false
        state.error = action.payload as string
        // Note: We might want to revert optimistic update here
      })
      
      // Update quantity cases
      .addCase(updateCartQuantity.pending, (state) => {
        state.isUpdating = true
        state.error = null
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.isUpdating = false
        // Quantity was already optimistically updated, just confirm success
        state.error = null
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.isUpdating = false
        state.error = action.payload as string
        // Note: We might want to revert optimistic update here
      })
      
      // Clear cart cases
      .addCase(clearCart.pending, (state) => {
        state.isUpdating = true
        state.error = null
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.isUpdating = false
        state.items = []
        state.totalPrice = 0
        state.totalItems = 0
        state.error = null
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isUpdating = false
        state.error = action.payload as string
      })
  },
})

export const {
  clearError,
  optimisticallyAddItem,
  optimisticallyRemoveItem,
  optimisticallyUpdateQuantity,
} = cartSlice.actions

export default cartSlice.reducer