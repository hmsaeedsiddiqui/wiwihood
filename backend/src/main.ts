import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';
import { config } from 'dotenv';

// Load environment variables
config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security middleware
  app.use(helmet());
  app.use(compression());

  // Enable CORS for all origins and IPs
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:7000',  // Add port 7000 for frontend
      'http://localhost:3000',  // Keep original port
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'Accept', 
      'Origin', 
      'X-Requested-With',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Methods'
    ],
    optionsSuccessStatus: 200, // For legacy browser support
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // API prefix
  app.setGlobalPrefix('api/v1');

  // Swagger documentation setup
  const config = new DocumentBuilder()
    .setTitle('Reservista API')
    .setDescription(`
      Comprehensive booking platform API for customers, providers, and admins.
      
      ## Features
      - **Authentication**: JWT-based authentication with role-based access control
      - **User Management**: Complete user profile and account management
      - **Provider Management**: Service provider registration and profile management
      - **Service Management**: Create and manage service offerings
      - **Booking System**: Full booking lifecycle management
      - **Payment Processing**: Secure payment and refund processing
      - **Review System**: Customer reviews and ratings
      - **Admin Panel**: Administrative controls and reporting
      
      ## Authentication
      Most endpoints require authentication via JWT token. Use the login endpoint to obtain tokens.
    `)
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter your JWT token here (without "Bearer" prefix)',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Authentication', 'User authentication and authorization endpoints')
    .addTag('Users', 'User management and profile endpoints')
    .addTag('Providers', 'Service provider management endpoints')
    .addTag('Services', 'Service management endpoints')
    .addTag('Staff', 'Staff management and multi-staff provider endpoints')
    .addTag('Bookings', 'Booking management endpoints')
    .addTag('Service Addons', 'Service add-ons and extras management')
    .addTag('Promotions', 'Promotions, deals and discount management endpoints')
    .addTag('Recurring Bookings', 'Recurring booking management endpoints')
    .addTag('Loyalty Program', 'Loyalty points and rewards endpoints')
    .addTag('Referrals', 'Referral program endpoints')
    .addTag('Payments', 'Payment processing endpoints')
    .addTag('Payment Methods', 'User payment methods management endpoints')
    .addTag('Reviews', 'Review and rating endpoints')
    .addTag('Admin', 'Administrative endpoints')
    .addServer('http://localhost:8000', 'Development server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 8000;
  await app.listen(port);
  
  console.log(`🚀 Reservista API is running on: http://localhost:${port}`);
  console.log(`📚 Swagger docs available at: http://localhost:${port}/api/docs`);
}

bootstrap();
