# 🔧 Service API Error Fix - Complete Solution

## ❌ **Original Error:**
```json
{
  "message": "Cannot POST /api/v1/services", 
  "error": "Not Found", 
  "statusCode": 404
}
```

## ✅ **Root Cause:**
1. **Wrong Endpoint**: You were calling `/api/v1/services` but your backend expects `/services`
2. **Missing Provider ID**: Backend requires `POST /services/provider/:providerId` (not just `/services`)
3. **No RTK Query**: Using old fetch-based API calls instead of RTK Query

## 🚀 **Complete Fix Implemented:**

### 1. Created RTK Query Services API (`src/store/api/servicesApi.ts`)
✅ **Correct Endpoints**:
- `POST /services/provider/:providerId` - Create service (requires provider ID)
- `GET /services` - Get all services with filters
- `GET /services/search` - Search services
- `GET /services/:id` - Get service by ID
- `PATCH /services/:id` - Update service
- `DELETE /services/:id` - Delete service

### 2. Added Custom Hooks (`src/hooks/useServices.ts`)
✅ **Easy-to-use hooks**:
```typescript
const { createService } = useCreateService()
const { services } = useServices({ categoryId: 'cat1' })
const { services: searchResults } = useSearchServices('haircut')
const { service } = useService('service-id')
```

### 3. Updated Redux Store (`src/store/index.ts`)
✅ **Added services API to store** with proper middleware and reducers

## 🎯 **How to Use (Replace Your Old Code):**

### **OLD WAY** ❌
```typescript
// This was causing the 404 error:
const response = await fetch('/api/v1/services', {
  method: 'POST',
  body: JSON.stringify(serviceData)
})
```

### **NEW WAY** ✅
```typescript
import { useCreateService } from '@/hooks/useServices'

function CreateServiceComponent() {
  const { createService, isLoading } = useCreateService()
  
  const handleCreate = async () => {
    try {
      const result = await createService('your-provider-id', {
        name: 'Hair Cut',
        description: 'Professional hair cutting service',
        shortDescription: 'Hair cut and styling',
        categoryId: 'hair-category-id',
        serviceType: 'appointment',
        price: 50,
        duration: 60,
        isActive: true
      })
      console.log('Service created:', result)
    } catch (error) {
      console.error('Failed to create service:', error)
    }
  }
  
  return (
    <button onClick={handleCreate} disabled={isLoading}>
      {isLoading ? 'Creating...' : 'Create Service'}
    </button>
  )
}
```

## 📋 **Quick Implementation Steps:**

### 1. **Import the hooks in your component:**
```typescript
import { useCreateService, useServices, useSearchServices } from '@/hooks/useServices'
```

### 2. **Use the hooks:**
```typescript
const { createService, isLoading } = useCreateService()
const { services } = useServices() // Gets all services
const { services: myServices } = useProviderServices('your-provider-id')
```

### 3. **Create a service (correct way):**
```typescript
await createService('provider-uuid', {
  name: 'Service Name',
  description: 'Full description',
  shortDescription: 'Short description',
  categoryId: 'category-uuid',
  serviceType: 'appointment', // or 'package' or 'consultation'
  price: 100,
  duration: 60, // minutes
  isActive: true,
  isOnlineBookingEnabled: true
})
```

## 🔍 **Debug Your Provider ID:**

The most common issue now will be getting the correct provider ID. Make sure you have:

```typescript
// Get provider ID from your auth state or user profile
const { user } = useAuthStatus()
const providerId = user?.provider?.id // or however you store it

// Or from URL params if you're on a provider dashboard
const { providerId } = useParams()
```

## 🧪 **Test the Fix:**

1. **Check your backend is running** on the correct port
2. **Verify the provider ID** exists in your database
3. **Use the example component** to test:

```typescript
import ServicesExample from '@/components/ServicesExample'

// Add this to any page to test
<ServicesExample />
```

## 📱 **Environment Setup:**

Make sure your `.env.local` has the correct backend URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## ✅ **Expected Success Response:**
```json
{
  "id": "service-uuid",
  "name": "Hair Cut and Style",
  "description": "Professional hair cutting service",
  "price": 50,
  "duration": 60,
  "isActive": true,
  "providerId": "provider-uuid",
  "categoryId": "category-uuid",
  "createdAt": "2025-01-13T...",
  "updatedAt": "2025-01-13T..."
}
```

## 🚨 **Common Issues & Solutions:**

1. **"Provider not found"** → Check if provider ID exists in database
2. **"Category not found"** → Use a valid category ID from your categories table
3. **"Unauthorized"** → Make sure user is logged in and has provider/admin role
4. **Validation errors** → Check required fields match the DTO structure

Your services API is now properly configured with RTK Query and will work with your NestJS backend! 🎉