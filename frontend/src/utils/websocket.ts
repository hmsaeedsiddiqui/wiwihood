import { io, Socket } from 'socket.io-client';

interface SocketConnection {
  socket: Socket | null;
  isConnected: boolean;
  subscriptions: Set<string>;
}

class AvailabilitySocketManager {
  private connection: SocketConnection = {
    socket: null,
    isConnected: false,
    subscriptions: new Set(),
  };

  private listeners: Map<string, Function[]> = new Map();

  constructor() {
    // Auto-connect if token exists
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('providerToken') || localStorage.getItem('accessToken');
      if (token) {
        this.connect(token);
      }
    }
  }

  /**
   * Connect to WebSocket server
   */
  connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.connection.isConnected) {
        resolve();
        return;
      }

      try {
        this.connection.socket = io('http://localhost:8000/availability', {
          auth: { token },
          transports: ['websocket'],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        this.connection.socket.on('connect', () => {
          console.log('✅ Connected to availability WebSocket');
          this.connection.isConnected = true;
          resolve();
        });

        this.connection.socket.on('disconnect', () => {
          console.log('❌ Disconnected from availability WebSocket');
          this.connection.isConnected = false;
        });

        this.connection.socket.on('connected', (data: any) => {
          console.log('🎉 WebSocket authentication successful:', data);
        });

        this.connection.socket.on('connect_error', (error: any) => {
          console.error('❌ WebSocket connection error:', error);
          this.connection.isConnected = false;
          reject(error);
        });

        // Set up automatic event listeners
        this.setupEventListeners();

      } catch (error) {
        console.error('❌ Failed to create WebSocket connection:', error);
        reject(error);
      }
    });
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.connection.socket) {
      this.connection.socket.disconnect();
      this.connection.socket = null;
      this.connection.isConnected = false;
      this.connection.subscriptions.clear();
      this.listeners.clear();
    }
  }

  /**
   * Subscribe to service availability updates
   */
  subscribeToService(serviceId: string): void {
    if (!this.connection.isConnected || !this.connection.socket) {
      console.warn('⚠️ Not connected to WebSocket. Cannot subscribe to service.');
      return;
    }

    const subscriptionKey = `service-${serviceId}`;
    if (this.connection.subscriptions.has(subscriptionKey)) {
      return; // Already subscribed
    }

    this.connection.socket.emit('subscribe-service-availability', { serviceId });
    this.connection.subscriptions.add(subscriptionKey);
    
    console.log(`📡 Subscribed to service availability: ${serviceId}`);
  }

  /**
   * Subscribe to provider availability updates
   */
  subscribeToProvider(providerId: string): void {
    if (!this.connection.isConnected || !this.connection.socket) {
      console.warn('⚠️ Not connected to WebSocket. Cannot subscribe to provider.');
      return;
    }

    const subscriptionKey = `provider-${providerId}`;
    if (this.connection.subscriptions.has(subscriptionKey)) {
      return; // Already subscribed
    }

    this.connection.socket.emit('subscribe-provider-availability', { providerId });
    this.connection.subscriptions.add(subscriptionKey);
    
    console.log(`📡 Subscribed to provider availability: ${providerId}`);
  }

  /**
   * Unsubscribe from service availability updates
   */
  unsubscribeFromService(serviceId: string): void {
    if (!this.connection.socket) return;

    const subscriptionKey = `service-${serviceId}`;
    if (this.connection.subscriptions.has(subscriptionKey)) {
      this.connection.socket.emit('unsubscribe-service-availability', { serviceId });
      this.connection.subscriptions.delete(subscriptionKey);
      console.log(`📡 Unsubscribed from service availability: ${serviceId}`);
    }
  }

  /**
   * Add event listener
   */
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);

    // Also add to socket if connected
    if (this.connection.socket) {
      this.connection.socket.on(event, callback as any);
    }
  }

  /**
   * Remove event listener
   */
  off(event: string, callback?: Function): void {
    if (callback) {
      const eventListeners = this.listeners.get(event);
      if (eventListeners) {
        const index = eventListeners.indexOf(callback);
        if (index > -1) {
          eventListeners.splice(index, 1);
        }
      }
      
      if (this.connection.socket) {
        this.connection.socket.off(event, callback as any);
      }
    } else {
      // Remove all listeners for this event
      this.listeners.delete(event);
      if (this.connection.socket) {
        this.connection.socket.removeAllListeners(event);
      }
    }
  }

  /**
   * Get connection status
   */
  get isConnected(): boolean {
    return this.connection.isConnected;
  }

  /**
   * Get active subscriptions
   */
  get subscriptions(): string[] {
    return Array.from(this.connection.subscriptions);
  }

  /**
   * Setup automatic event listeners for common events
   */
  private setupEventListeners(): void {
    if (!this.connection.socket) return;

    // Provider availability events
    this.connection.socket.on('provider-availability-changed', (data: any) => {
      console.log('🔄 Provider availability changed:', data);
      this.notifyListeners('provider-availability-changed', data);
    });

    this.connection.socket.on('working-hours-changed', (data: any) => {
      console.log('🕒 Working hours changed:', data);
      this.notifyListeners('working-hours-changed', data);
    });

    this.connection.socket.on('blocked-times-changed', (data: any) => {
      console.log('🚫 Blocked times changed:', data);
      this.notifyListeners('blocked-times-changed', data);
    });

    this.connection.socket.on('time-slots-updated', (data: any) => {
      console.log('📅 Time slots updated:', data);
      this.notifyListeners('time-slots-updated', data);
    });

    // Service-specific events
    this.connection.socket.on('service-availability-changed', (data: any) => {
      console.log('🛠️ Service availability changed:', data);
      this.notifyListeners('service-availability-changed', data);
    });

    this.connection.socket.on('service-time-slots-changed', (data: any) => {
      console.log('📋 Service time slots changed:', data);
      this.notifyListeners('service-time-slots-changed', data);
    });

    // Booking events
    this.connection.socket.on('slot-booked', (data: any) => {
      console.log('✅ Slot booked:', data);
      this.notifyListeners('slot-booked', data);
    });

    this.connection.socket.on('booking-update', (data: any) => {
      console.log('📝 Booking update:', data);
      this.notifyListeners('booking-update', data);
    });

    // Setup listeners for registered callbacks
    this.listeners.forEach((callbacks, event) => {
      callbacks.forEach(callback => {
        this.connection.socket!.on(event, callback as any);
      });
    });
  }

  /**
   * Notify all registered listeners for an event
   */
  private notifyListeners(event: string, data: any): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} listener:`, error);
        }
      });
    }
  }
}

// Export singleton instance
export const availabilitySocket = new AvailabilitySocketManager();

// Export utility hooks for React components
export const useAvailabilitySocket = () => {
  return {
    connect: availabilitySocket.connect.bind(availabilitySocket),
    disconnect: availabilitySocket.disconnect.bind(availabilitySocket),
    subscribeToService: availabilitySocket.subscribeToService.bind(availabilitySocket),
    subscribeToProvider: availabilitySocket.subscribeToProvider.bind(availabilitySocket),
    unsubscribeFromService: availabilitySocket.unsubscribeFromService.bind(availabilitySocket),
    on: availabilitySocket.on.bind(availabilitySocket),
    off: availabilitySocket.off.bind(availabilitySocket),
    isConnected: availabilitySocket.isConnected,
    subscriptions: availabilitySocket.subscriptions,
  };
};