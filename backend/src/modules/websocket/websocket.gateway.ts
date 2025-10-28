import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'], // Frontend URLs
    credentials: true,
  },
  namespace: '/availability',
})
@Injectable()
export class AvailabilityGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(AvailabilityGateway.name);

  async handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    client.emit('connected', {
      message: 'Successfully connected to availability updates',
      id: client.id,
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // =================== SUBSCRIPTION METHODS ===================

  @SubscribeMessage('subscribe-service-availability')
  async subscribeToService(
    @MessageBody() data: { serviceId: string },
    @ConnectedSocket() client: Socket,
  ) {
    await client.join(`service-${data.serviceId}`);
    client.emit('subscribed', { 
      type: 'service-availability', 
      serviceId: data.serviceId 
    });
    this.logger.log(`Client ${client.id} subscribed to service ${data.serviceId}`);
  }

  @SubscribeMessage('subscribe-provider-availability')
  async subscribeToProvider(
    @MessageBody() data: { providerId: string },
    @ConnectedSocket() client: Socket,
  ) {
    await client.join(`provider-availability-${data.providerId}`);
    client.emit('subscribed', { 
      type: 'provider-availability', 
      providerId: data.providerId 
    });
    this.logger.log(`Client ${client.id} subscribed to provider ${data.providerId}`);
  }

  @SubscribeMessage('unsubscribe-service-availability')
  async unsubscribeFromService(
    @MessageBody() data: { serviceId: string },
    @ConnectedSocket() client: Socket,
  ) {
    await client.leave(`service-${data.serviceId}`);
    client.emit('unsubscribed', { 
      type: 'service-availability', 
      serviceId: data.serviceId 
    });
  }

  // =================== NOTIFICATION METHODS ===================

  /**
   * Notify when service-specific availability changes
   */
  async notifyServiceAvailabilityUpdate(serviceId: string, providerId: string, update: any) {
    const notification = {
      type: 'service-availability-updated',
      serviceId,
      providerId,
      timestamp: new Date().toISOString(),
      data: update,
    };

    // Notify clients subscribed to this specific service
    this.server.to(`service-${serviceId}`).emit('service-availability-changed', notification);
    
    // Also notify provider
    this.server.to(`provider-${providerId}`).emit('service-availability-updated', notification);
    
    this.logger.log(`Notified service availability update for service ${serviceId}`);
  }

  /**
   * Notify when time slots are generated or updated
   */
  async notifyTimeSlotsUpdate(providerId: string, serviceId: string | null, timeSlots: any[]) {
    const notification = {
      type: 'time-slots-updated',
      providerId,
      serviceId,
      timestamp: new Date().toISOString(),
      data: { timeSlots },
    };

    // Notify provider
    this.server.to(`provider-${providerId}`).emit('time-slots-updated', notification);
    
    // If service-specific, notify service subscribers
    if (serviceId) {
      this.server.to(`service-${serviceId}`).emit('service-time-slots-changed', notification);
    }
    
    this.logger.log(`Notified time slots update for provider ${providerId}, service: ${serviceId || 'all'}`);
  }

  /**
   * Notify when provider updates their availability
   */
  async notifyProviderAvailabilityChanged(providerId: string, update: any) {
    const notification = {
      type: 'provider-availability-updated',
      providerId,
      timestamp: new Date().toISOString(),
      data: update,
    };

    // Notify all clients subscribed to this provider's availability
    this.server.to(`provider-availability-${providerId}`).emit('provider-availability-changed', notification);
    
    this.logger.log(`Notified availability update for provider ${providerId}`);
  }
}