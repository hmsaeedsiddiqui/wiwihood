import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// UI state interface
interface UIState {
  // Modals
  modals: {
    login: boolean
    signup: boolean
    cart: boolean
    booking: boolean
    profile: boolean
    notifications: boolean
    filters: boolean
  }
  
  // Sidebars and drawers
  sidebarOpen: boolean
  mobileMenuOpen: boolean
  
  // Loading states
  pageLoading: boolean
  
  // Theme
  theme: 'light' | 'dark'
  
  // Layout
  layout: 'grid' | 'list'
  
  // Search
  searchOpen: boolean
  
  // Alerts and confirmations
  activeAlert: {
    type: 'success' | 'error' | 'warning' | 'info' | null
    message: string | null
    title?: string | null
  }
  
  // Confirmation dialog
  confirmDialog: {
    open: boolean
    title: string
    message: string
    onConfirm?: () => void
    onCancel?: () => void
    confirmText?: string
    cancelText?: string
    variant?: 'danger' | 'warning' | 'info'
  }
}

// Initial state
const initialState: UIState = {
  modals: {
    login: false,
    signup: false,
    cart: false,
    booking: false,
    profile: false,
    notifications: false,
    filters: false,
  },
  sidebarOpen: false,
  mobileMenuOpen: false,
  pageLoading: false,
  theme: 'light',
  layout: 'grid',
  searchOpen: false,
  activeAlert: {
    type: null,
    message: null,
    title: null,
  },
  confirmDialog: {
    open: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    variant: 'info',
  },
}

// UI slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Modal management
    openModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
      // Close all modals first
      Object.keys(state.modals).forEach(key => {
        state.modals[key as keyof UIState['modals']] = false
      })
      // Open the requested modal
      state.modals[action.payload] = true
    },
    closeModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
      state.modals[action.payload] = false
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(key => {
        state.modals[key as keyof UIState['modals']] = false
      })
    },
    
    // Sidebar and menu management
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen
    },
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileMenuOpen = action.payload
    },
    
    // Loading state
    setPageLoading: (state, action: PayloadAction<boolean>) => {
      state.pageLoading = action.payload
    },
    
    // Theme management
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload
      // Persist theme to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', action.payload)
      }
    },
    toggleTheme: (state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light'
      state.theme = newTheme
      // Persist theme to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', newTheme)
      }
    },
    
    // Layout management
    setLayout: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.layout = action.payload
    },
    toggleLayout: (state) => {
      state.layout = state.layout === 'grid' ? 'list' : 'grid'
    },
    
    // Search management
    setSearchOpen: (state, action: PayloadAction<boolean>) => {
      state.searchOpen = action.payload
    },
    toggleSearch: (state) => {
      state.searchOpen = !state.searchOpen
    },
    
    // Alert management
    showAlert: (state, action: PayloadAction<{
      type: 'success' | 'error' | 'warning' | 'info'
      message: string
      title?: string
    }>) => {
      state.activeAlert = action.payload
    },
    hideAlert: (state) => {
      state.activeAlert = {
        type: null,
        message: null,
        title: null,
      }
    },
    
    // Confirmation dialog management
    showConfirmDialog: (state, action: PayloadAction<{
      title: string
      message: string
      onConfirm?: () => void
      onCancel?: () => void
      confirmText?: string
      cancelText?: string
      variant?: 'danger' | 'warning' | 'info'
    }>) => {
      state.confirmDialog = {
        open: true,
        title: action.payload.title,
        message: action.payload.message,
        confirmText: action.payload.confirmText || 'Confirm',
        cancelText: action.payload.cancelText || 'Cancel',
        variant: action.payload.variant || 'info',
        // Note: Functions can't be serialized in Redux, so we'll handle them differently
      }
    },
    hideConfirmDialog: (state) => {
      state.confirmDialog = {
        ...state.confirmDialog,
        open: false,
      }
    },
    
    // Reset all UI state
    resetUI: (state) => {
      Object.assign(state, initialState)
    },
  },
})

export const {
  openModal,
  closeModal,
  closeAllModals,
  toggleSidebar,
  setSidebarOpen,
  toggleMobileMenu,
  setMobileMenuOpen,
  setPageLoading,
  setTheme,
  toggleTheme,
  setLayout,
  toggleLayout,
  setSearchOpen,
  toggleSearch,
  showAlert,
  hideAlert,
  showConfirmDialog,
  hideConfirmDialog,
  resetUI,
} = uiSlice.actions

export default uiSlice.reducer