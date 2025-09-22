import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealthStatus(): object {
    return {
      status: 'OK',
      message: 'Reservista API is running successfully',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      features: {
        authentication: 'implemented ✅',
        userManagement: 'implemented ✅',
        providerManagement: 'implemented ✅',
        serviceManagement: 'pending 🔄',
        bookingSystem: 'pending 🔄',
        paymentProcessing: 'pending 🔄',
        reviewSystem: 'pending 🔄',
        adminPanel: 'pending 🔄',
        notifications: 'planned 📋',
        calendar: 'planned 📋'
      },
      endpoints: {
        authentication: '/auth',
        users: '/users',
        providers: '/providers',
        documentation: '/docs'
      }
    };
  }
}
