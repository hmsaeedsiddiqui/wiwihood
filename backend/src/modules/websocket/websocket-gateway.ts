import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';

@WebSocketGateway({ namespace: '/availability', cors: { origin: '*' } })
@Injectable()
export class AvailabilityGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(AvailabilityGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    // Optionally handle auth from query or handshake
    client.emit('connected', { id: client.id });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribe-service-availability')
  handleSubscribeService(@MessageBody() data: { serviceId: string }, @ConnectedSocket() client: Socket) {
    const room = `service-${data.serviceId}`;
    client.join(room);
    this.logger.log(`Client ${client.id} joined room ${room}`);
    client.emit('subscribed', { room });
  }

  @SubscribeMessage('unsubscribe-service-availability')
  handleUnsubscribeService(@MessageBody() data: { serviceId: string }, @ConnectedSocket() client: Socket) {
    const room = `service-${data.serviceId}`;
    client.leave(room);
    this.logger.log(`Client ${client.id} left room ${room}`);
    client.emit('unsubscribed', { room });
  }

  @SubscribeMessage('subscribe-provider-availability')
  handleSubscribeProvider(@MessageBody() data: { providerId: string }, @ConnectedSocket() client: Socket) {
    const room = `provider-${data.providerId}`;
    client.join(room);
    this.logger.log(`Client ${client.id} joined room ${room}`);
    client.emit('subscribed', { room });
  }

  @SubscribeMessage('unsubscribe-provider-availability')
  handleUnsubscribeProvider(@MessageBody() data: { providerId: string }, @ConnectedSocket() client: Socket) {
    const room = `provider-${data.providerId}`;
    client.leave(room);
    this.logger.log(`Client ${client.id} left room ${room}`);
    client.emit('unsubscribed', { room });
  }

  // Methods called by backend services to notify clients
  async notifyServiceAvailabilityUpdate(serviceId: string, providerId: string, payload: any) {
    const room = `service-${serviceId}`;
    this.logger.log(`Emitting service-availability-changed to ${room}`);
    this.server.to(room).emit('service-availability-changed', payload);

    // Also notify provider-level subscribers
    const providerRoom = `provider-${providerId}`;
    this.server.to(providerRoom).emit('service-availability-changed', payload);
  }

  async notifyTimeSlotsUpdate(providerId: string, serviceId: string, slots: any[]) {
    const room = `service-${serviceId}`;
    this.logger.log(`Emitting service-time-slots-changed to ${room}`);
    this.server.to(room).emit('service-time-slots-changed', { serviceId, slots });

    const providerRoom = `provider-${providerId}`;
    this.server.to(providerRoom).emit('time-slots-updated', { serviceId, slots });
  }

  async notifyProviderAvailabilityChanged(providerId: string, payload: any) {
    const room = `provider-${providerId}`;
    this.logger.log(`Emitting provider-availability-changed to ${room}`);
    this.server.to(room).emit('provider-availability-changed', payload);
  }
}