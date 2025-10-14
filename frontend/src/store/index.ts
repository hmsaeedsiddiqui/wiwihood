import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from '@reduxjs/toolkit'

// Import slice reducers
import authReducer from './slices/authSlice'
import bookingReducer from './slices/bookingSlice'
import serviceReducer from './slices/serviceSlice'
import providerReducer from './slices/providerSlice'
import cartReducer from './slices/cartSlice'
import notificationReducer from './slices/notificationSlice'
import uiReducer from './slices/uiSlice'
import adminCategoriesReducer from './slices/adminCategoriesSlice'

// Import RTK Query APIs
import { authApi } from './api/authApi'
import { servicesApi } from './api/servicesApi'
import { userApi } from './api/userApi'
import { providersApi } from './api/providersApi'
import { adminCategoriesApi } from './api/adminCategoriesApi'

// Root reducer combining all slices
const rootReducer = combineReducers({  
  auth: authReducer,
  booking: bookingReducer,
  service: serviceReducer,
  provider: providerReducer,
  cart: cartReducer,
  notification: notificationReducer,
  ui: uiReducer,
  adminCategories: adminCategoriesReducer,
  // Add RTK Query API reducers
  [authApi.reducerPath]: authApi.reducer,
  [servicesApi.reducerPath]: servicesApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [providersApi.reducerPath]: providersApi.reducer,
  [adminCategoriesApi.reducerPath]: adminCategoriesApi.reducer,
})

// Configure store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [],
      },
    }).concat(authApi.middleware, servicesApi.middleware, userApi.middleware, providersApi.middleware, adminCategoriesApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
})

// Export types
export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch

// Export store instance
export default store