/**
 * Utility functions for generating and handling SEO-friendly slugs
 */

/**
 * Convert a string to a URL-friendly slug
 * @param text - The text to convert to slug
 * @returns URL-friendly slug string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Replace spaces and special characters with hyphens
    .replace(/[\s\W-]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Limit length to 50 characters
    .substring(0, 50)
    // Remove trailing hyphen if substring cut off mid-word
    .replace(/-+$/, '')
}

/**
 * Generate a unique slug by combining service name with provider name
 * @param serviceName - Name of the service
 * @param providerName - Name of the provider/business
 * @param serviceId - Optional: Last 8 characters of UUID for uniqueness
 * @returns Unique slug string
 */
export function generateUniqueSlug(
  serviceName: string, 
  providerName?: string, 
  serviceId?: string
): string {
  let slug = generateSlug(serviceName)
  
  // Add provider name for uniqueness if available
  if (providerName && providerName.trim()) {
    const providerSlug = generateSlug(providerName)
    slug = `${slug}-${providerSlug}`
  }
  
  // Add last 8 chars of UUID for guaranteed uniqueness if needed
  if (serviceId && serviceId.length >= 8) {
    const shortId = serviceId.slice(-8)
    slug = `${slug}-${shortId}`
  }
  
  return slug
}

/**
 * Extract service information from slug
 * @param slug - The URL slug
 * @returns Object with extracted information
 */
export function parseSlug(slug: string) {
  const parts = slug.split('-')
  const hasId = parts.length > 0 && parts[parts.length - 1].length === 8
  
  return {
    slug,
    hasShortId: hasId,
    shortId: hasId ? parts[parts.length - 1] : null,
    nameSlug: hasId ? parts.slice(0, -1).join('-') : slug
  }
}

/**
 * Create service URL using slug
 * @param slug - Service slug
 * @returns Service detail URL
 */
export function createServiceUrl(slug: string): string {
  return `/services/${slug}`
}

/**
 * Create booking URL using slug
 * @param slug - Service slug
 * @returns Booking URL
 */
export function createBookingUrl(slug: string): string {
  return `/services/book-now?service=${slug}`
}