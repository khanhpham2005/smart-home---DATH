import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

class WebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.reconnectInterval = 5000;
    this.maxReconnectAttempts = 5;
    this.reconnectAttempts = 0;
    this.subscriptions = new Map();
  }

  /**
   * Connect to WebSocket with JWT authentication
   * @param {string} token - JWT token from login
   * @param {function} onConnect - Callback when connected
   * @param {function} onError - Callback on error
   */
  connect(token, onConnect, onError) {
    if (this.connected) {
      console.log('WebSocket already connected');
      return;
    }

    const wsUrl = `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/api/ws?token=${token}`;
    
    this.client = new Client({
      brokerURL: wsUrl,
      connectHeaders: {
        login: token,
      },
      debug: (str) => console.log('[STOMP]', str),
      reconnectDelay: this.reconnectInterval,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: (frame) => {
        this.connected = true;
        this.reconnectAttempts = 0;
        console.log('WebSocket connected:', frame);
        if (onConnect) {
          onConnect(frame);
        }
      },
      onStompError: (frame) => {
        this.connected = false;
        console.error('STOMP Error:', frame);
        if (onError) {
          onError(frame);
        }
        this.attemptReconnect(token, onConnect, onError);
      },
      onWebSocketError: (event) => {
        this.connected = false;
        console.error('WebSocket Error:', event);
        if (onError) {
          onError(event);
        }
        this.attemptReconnect(token, onConnect, onError);
      },
      onWebSocketClose: () => {
        this.connected = false;
        console.warn('WebSocket closed');
        this.attemptReconnect(token, onConnect, onError);
      },
    });

    this.client.activate();
  }

  /**
   * Attempt to reconnect with backoff
   */
  attemptReconnect(token, onConnect, onError) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnecting... attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      setTimeout(() => {
        this.connect(token, onConnect, onError);
      }, this.reconnectInterval * this.reconnectAttempts);
    } else {
      console.error('Max reconnect attempts reached');
    }
  }

  /**
   * Subscribe to topic for real-time updates
   * @param {string} topic - Topic path (e.g., '/topic/users/1')
   * @param {function} callback - Callback function for messages
   * @returns {string} - Subscription ID
   */
  subscribe(topic, callback) {
    if (!this.connected || !this.client) {
      console.error('WebSocket not connected');
      return null;
    }

    const subscriptionId = `${topic}-${Date.now()}`;
    
    const subscription = this.client.subscribe(topic, (message) => {
      try {
        const data = JSON.parse(message.body);
        callback(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    this.subscriptions.set(subscriptionId, subscription);
    console.log(`Subscribed to ${topic}`);
    
    return subscriptionId;
  }

  /**
   * Unsubscribe from topic
   * @param {string} subscriptionId - ID returned from subscribe()
   */
  unsubscribe(subscriptionId) {
    const subscription = this.subscriptions.get(subscriptionId);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(subscriptionId);
      console.log(`Unsubscribed from ${subscriptionId}`);
    }
  }

  /**
   * Send message to app destination
   * @param {string} destination - Destination path (e.g., '/app/send')
   * @param {object} body - Message body
   */
  send(destination, body) {
    if (!this.connected || !this.client) {
      console.error('WebSocket not connected');
      return;
    }

    this.client.publish({
      destination,
      body: JSON.stringify(body),
    });
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect() {
    // Unsubscribe from all topics
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions.clear();

    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }

    this.connected = false;
    console.log('WebSocket disconnected');
  }

  /**
   * Check if WebSocket is connected
   */
  isConnected() {
    return this.connected;
  }
}

// Export singleton instance
export default new WebSocketService();
