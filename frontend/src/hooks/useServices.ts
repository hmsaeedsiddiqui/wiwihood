import { useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { 
  useCreateServiceMutation,
  useGetServicesQuery,
  useSearchServicesQuery,
  useGetPopularServicesQuery,
  useGetServiceByIdQuery,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useGetServicesByProviderQuery,
  useGetServicesByCategoryQuery,
} from '../store/api/servicesApi'
import type { 
  CreateServiceRequest, 
  UpdateServiceRequest,
  ServiceFilterRequest,
  Service,
  ApiError 
} from '../store/api/servicesApi'

// Custom hook for creating a service
export const useCreateService = () => {
  const [createServiceMutation, { isLoading, error }] = useCreateServiceMutation()

  const createService = useCallback(async (providerId: string, serviceData: CreateServiceRequest) => {
    try {
      const result = await createServiceMutation({ providerId, serviceData }).unwrap()
      toast.success(`Service "${result.name}" created successfully!`)
      return result
    } catch (err) {
      const error = err as ApiError
      toast.error(error.message || 'Failed to create service')
      throw error
    }
  }, [createServiceMutation])

  return {
    createService,
    isLoading,
    error
  }
}

// Custom hook for fetching services with filters
export const useServices = (filters?: ServiceFilterRequest) => {
  const { 
    data: services = [], 
    isLoading, 
    error, 
    refetch 
  } = useGetServicesQuery(filters || {})

  return {
    services,
    isLoading,
    error,
    refetch
  }
}

// Custom hook for searching services
export const useSearchServices = (query: string, filters?: ServiceFilterRequest) => {
  const { 
    data: services = [], 
    isLoading, 
    error, 
    refetch 
  } = useSearchServicesQuery({ query, filters }, {
    skip: !query || query.length < 2 // Don't search if query is too short
  })

  return {
    services,
    isLoading,
    error,
    refetch
  }
}

// Custom hook for popular services
export const usePopularServices = (limit?: number) => {
  const { 
    data: services = [], 
    isLoading, 
    error, 
    refetch 
  } = useGetPopularServicesQuery({ limit })

  return {
    services,
    isLoading,
    error,
    refetch
  }
}

// Custom hook for a single service
export const useService = (id: string) => {
  const { 
    data: service, 
    isLoading, 
    error, 
    refetch 
  } = useGetServiceByIdQuery(id, {
    skip: !id
  })

  return {
    service,
    isLoading,
    error,
    refetch
  }
}

// Custom hook for updating a service
export const useUpdateService = () => {
  const [updateServiceMutation, { isLoading, error }] = useUpdateServiceMutation()

  const updateService = useCallback(async (id: string, serviceData: UpdateServiceRequest) => {
    try {
      const result = await updateServiceMutation({ id, serviceData }).unwrap()
      toast.success(`Service "${result.name}" updated successfully!`)
      return result
    } catch (err) {
      const error = err as ApiError
      toast.error(error.message || 'Failed to update service')
      throw error
    }
  }, [updateServiceMutation])

  return {
    updateService,
    isLoading,
    error
  }
}

// Custom hook for deleting a service
export const useDeleteService = () => {
  const [deleteServiceMutation, { isLoading, error }] = useDeleteServiceMutation()

  const deleteService = useCallback(async (id: string, serviceName?: string) => {
    try {
      await deleteServiceMutation(id).unwrap()
      toast.success(`Service${serviceName ? ` "${serviceName}"` : ''} deleted successfully!`)
      return true
    } catch (err) {
      const error = err as ApiError
      toast.error(error.message || 'Failed to delete service')
      throw error
    }
  }, [deleteServiceMutation])

  return {
    deleteService,
    isLoading,
    error
  }
}

// Custom hook for provider services
export const useProviderServices = (providerId: string, filters?: ServiceFilterRequest) => {
  const { 
    data: services = [], 
    isLoading, 
    error, 
    refetch 
  } = useGetServicesByProviderQuery({ providerId, filters }, {
    skip: !providerId
  })

  return {
    services,
    isLoading,
    error,
    refetch
  }
}

// Custom hook for category services
export const useCategoryServices = (categoryId: string, filters?: ServiceFilterRequest) => {
  const { 
    data: services = [], 
    isLoading, 
    error, 
    refetch 
  } = useGetServicesByCategoryQuery({ categoryId, filters }, {
    skip: !categoryId
  })

  return {
    services,
    isLoading,
    error,
    refetch
  }
}

// Helper hook for service operations
export const useServiceOperations = () => {
  const { createService, isLoading: creating } = useCreateService()
  const { updateService, isLoading: updating } = useUpdateService()
  const { deleteService, isLoading: deleting } = useDeleteService()

  return {
    createService,
    updateService,
    deleteService,
    isOperating: creating || updating || deleting
  }
}