import { useGetUserProfileQuery } from '@/store/api/userApi'
import { getDemoUserProfile } from '@/store/api/userApi'

export const useUserProfile = () => {
  const { data, error, isLoading, refetch } = useGetUserProfileQuery()
  
  console.log('useUserProfile Debug:', { data, error, isLoading })
  
  // If loading, return loading state
  if (isLoading) {
    return {
      data: null,
      error: null,
      isLoading: true,
      refetch,
      isDemo: false
    }
  }
  
  // If we have successful data from backend
  if (data && !error) {
    console.log('✅ Successfully fetched data from backend:', data)
    return {
      data,
      error: null,
      isLoading: false,
      refetch,
      isDemo: false
    }
  }
  
  // If there's an error (network/backend unavailable), use localStorage data as fallback
  if (error) {
    console.log('❌ Backend API error:', error)
    console.log('Error details:', { 
      status: (error as any)?.status, 
      originalStatus: (error as any)?.originalStatus,
      data: (error as any)?.data 
    })
    
    // Check if it's a network error (FETCH_ERROR) or server error
    const isNetworkError = (error as any)?.status === 'FETCH_ERROR' || 
                          (error as any)?.status === 500 || 
                          (error as any)?.originalStatus === 500
    
    if (isNetworkError) {
      console.log('🔄 Network error detected, using localStorage fallback')
      return {
        data: getDemoUserProfile(),
        error: null,
        isLoading: false,
        refetch,
        isDemo: true
      }
    } else {
      console.log('🚫 Authentication/Authorization error, showing error state')
      // For other errors (like 401, 404), return the actual error
      return {
        data: null,
        error,
        isLoading: false,
        refetch,
        isDemo: false
      }
    }
  }
  
  // Default fallback
  return {
    data: null,
    error: null,
    isLoading: false,
    refetch,
    isDemo: false
  }
}