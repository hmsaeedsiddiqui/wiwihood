import { Service } from '@/store/api/servicesApi'
import { generateUniqueSlug } from './slugify'

/**
 * Transform service data to include slug field
 * @param service - Service object from API
 * @returns Service object with slug field
 */
export function transformServiceWithSlug(service: Service): Service {
  // Generate slug if not provided by API
  if (!service.slug) {
    const slug = generateUniqueSlug(
      service.name,
      service.providerBusinessName,
      service.id
    )
    return {
      ...service,
      slug
    }
  }
  return service
}

/**
 * Transform array of services to include slug fields
 * @param services - Array of services from API
 * @returns Array of services with slug fields
 */
export function transformServicesWithSlugs(services: Service[]): Service[] {
  return services.map(transformServiceWithSlug)
}

/**
 * Find service by slug from services array
 * @param services - Array of services
 * @param slug - Service slug to find
 * @returns Found service or null
 */
export function findServiceBySlug(services: Service[], slug: string): Service | null {
  return services.find(service => {
    const serviceSlug = service.slug || generateUniqueSlug(
      service.name,
      service.providerBusinessName,
      service.id
    )
    return serviceSlug === slug
  }) || null
}

/**
 * Get service slug for URL generation
 * @param service - Service object
 * @returns Service slug
 */
export function getServiceSlug(service: Service): string {
  return service.slug || generateUniqueSlug(
    service.name,
    service.providerBusinessName,
    service.id
  )
}