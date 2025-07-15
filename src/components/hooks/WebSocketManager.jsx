class WebSocketManager {
  constructor(url) {
    const API_SOCKET_URL = import.meta.env.VITE_API_SOCKET_URL;
    this.url = `${API_SOCKET_URL}${url}`;
    this.socket = null;
    this.messageHandlers = new Set();
    this.connectionListeners = {
      open: new Set(),
      close: new Set(),
      error: new Set()
    };
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 3000;
    this.autoReconnect = true;
  }

  connect() {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      console.warn('WebSocket is already connected or connecting');
      return;
    }

    this.socket = new WebSocket(this.url);

    this.socket.onopen = (event) => {
      this.reconnectAttempts = 0;
      this.connectionListeners.open.forEach(listener => listener(event));
    };

    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.messageHandlers.forEach(handler => handler(message));
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    this.socket.onclose = (event) => {
      this.connectionListeners.close.forEach(listener => listener(event));
      if (this.autoReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
        setTimeout(() => {
          this.reconnectAttempts++;
          console.log(`Reconnecting... Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
          this.connect();
        }, this.reconnectInterval);
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.connectionListeners.error.forEach(listener => listener(error));
    };
  }

  send(message) {
    if (this.isConnected()) {
      if (typeof message !== 'string') {
        message = JSON.stringify(message);
      }
      this.socket.send(message);
    } else {
      console.error('Cannot send message - WebSocket not connected');
    }
  }

  addMessageHandler(handler) {
    this.messageHandlers.add(handler);
  }

  removeMessageHandler(handler) {
    this.messageHandlers.delete(handler);
  }

  addConnectionListener(type, handler) {
    if (this.connectionListeners[type]) {
      this.connectionListeners[type].add(handler);
    }
  }

  removeConnectionListener(type, handler) {
    if (this.connectionListeners[type]) {
      this.connectionListeners[type].delete(handler);
    }
  }

  isConnected() {
    return this.socket && this.socket.readyState === WebSocket.OPEN;
  }

  disconnect() {
    this.autoReconnect = false;
    if (this.socket) {
      this.socket.close();
    }
  }

  reconnect() {
    this.disconnect();
    this.autoReconnect = true;
    this.connect();
  }
}

export default WebSocketManager;