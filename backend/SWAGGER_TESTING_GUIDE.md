📋 SWAGGER UI MEIN TEST KARNE KE STEPS:

1. ✅ Server running hai: http://localhost:8000
2. ✅ Swagger docs: http://localhost:8000/api/docs

3. AUTHENTICATION:
   - Swagger UI mein "Authorize" button pe click karein
   - Bearer token paste karein: 
     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0NzRhNWRmMy02MGNmLTQ0NmEtYjQ0Ni1hOTc2M2IyNmE4MWUiLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwicm9sZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzU5NzMzNDUzLCJleHAiOjE3NTk3MzcwNTN9.yieDwO-HXnM9Iciz087A78ZdmYX1r7CCWSYMg9oYVIY

4. REGULAR BOOKING TEST:
   Endpoint: POST /api/v1/bookings
   Request Body (real UUIDs):
   {
     "serviceId": "19f77203-2904-4e96-bcad-78d5ca984c7c",
     "providerId": "550e8400-e29b-41d4-a716-446655440011",
     "startTime": "2025-10-15T10:00:00Z",
     "endTime": "2025-10-15T11:00:00Z",
     "totalPrice": 50,
     "platformFee": 5,
     "notes": "Please call before arrival",
     "status": "pending"
   }

5. RECURRING BOOKING TEST:
   Endpoint: POST /api/v1/recurring-bookings
   Request Body (real UUIDs):
   {
     "providerId": "550e8400-e29b-41d4-a716-446655440011",
     "serviceId": "19f77203-2904-4e96-bcad-78d5ca984c7c",
     "frequency": "weekly",
     "startTime": "10:30",
     "durationMinutes": 60,
     "nextBookingDate": "2025-01-15",
     "endDate": "2025-12-31",
     "maxBookings": 52,
     "specialInstructions": "Please use side entrance",
     "autoConfirm": true,
     "notificationPreferences": {
       "email": true,
       "sms": false,
       "reminderDaysBefore": [1, 7]
     }
   }

6. DATABASE MEIN AVAILABLE UUIDs:
   - Provider ID: 550e8400-e29b-41d4-a716-446655440011 (Glamour Beauty Salon)
   - Service ID: 19f77203-2904-4e96-bcad-78d5ca984c7c (Hair cut)
   - User ID: 699fc26e-db55-480f-8826-c380c31e9b5f (umar@gamil.com)

🎯 KEY POINT: 
- "uuid-string" ye placeholder text hai - isko replace karna hai real UUIDs se
- Copy-paste kar dein oopar wale actual UUIDs ko