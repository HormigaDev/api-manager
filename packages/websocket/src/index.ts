export interface WebSocketOptions {
    url: string;
    debug?: boolean;
    autoConnect?: boolean;
    reconnect?: boolean;
    reconnectIntervalMs?: number;
    heartbeatIntervalMs?: number;
}

type Listener = (data: any) => void;

export class ApiWebSocket {
    private socket?: WebSocket;
    private listeners: Map<string, Set<Listener>> = new Map();
    private heartbeatTimer?: ReturnType<typeof setInterval>;
    private reconnectTimer?: ReturnType<typeof setTimeout>;
    private connected = false;
    private manuallyClosed = false;

    private readonly url: string;
    private readonly debug: boolean;
    private readonly reconnect: boolean;
    private readonly reconnectIntervalMs: number;
    private readonly heartbeatIntervalMs: number;

    constructor(options: WebSocketOptions) {
        this.url = options.url;
        this.debug = options.debug ?? false;
        this.reconnect = options.reconnect ?? true;
        this.reconnectIntervalMs = options.reconnectIntervalMs ?? 3000;
        this.heartbeatIntervalMs = options.heartbeatIntervalMs ?? 10000;

        if (options.autoConnect ?? true) {
            this.connect();
        }
    }

    connect() {
        if (this.socket || this.connected) return;

        this.manuallyClosed = false;
        this.socket = new WebSocket(this.url);

        this.socket.addEventListener('open', () => {
            this.connected = true;
            this.log('[WS] Connected');
            this.startHeartbeat();
        });

        this.socket.addEventListener('close', () => {
            this.log('[WS] Disconnected');
            this.cleanup();
            if (!this.manuallyClosed && this.reconnect) {
                this.scheduleReconnect();
            }
        });

        this.socket.addEventListener('error', (e) => {
            this.logError('[WS] Error', e);
        });

        this.socket.addEventListener('message', (e) => {
            this.handleMessage(e.data);
        });
    }

    private handleMessage(raw: string) {
        try {
            const parsed = JSON.parse(raw);
            if (parsed.event === '__pong__') return;

            const handlers = this.listeners.get(parsed.event);
            if (handlers) {
                handlers.forEach((fn) => fn(parsed.data));
            }
        } catch {
            this.logError('[WS] Invalid message format', raw);
        }
    }

    send(event: string, data: any) {
        if (!this.connected || !this.socket || this.socket.readyState !== WebSocket.OPEN) {
            throw new Error('WebSocket is not open');
        }
        this.socket.send(JSON.stringify({ event, data }));
    }

    on(event: string, handler: Listener) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)!.add(handler);
    }

    off(event: string, handler: Listener) {
        this.listeners.get(event)?.delete(handler);
    }

    close() {
        this.manuallyClosed = true;
        this.cleanup();
        this.socket?.close();
    }

    isConnected() {
        return this.connected;
    }

    private cleanup() {
        this.connected = false;
        this.stopHeartbeat();
        this.socket = undefined;
    }

    private startHeartbeat() {
        this.stopHeartbeat();
        this.heartbeatTimer = setInterval(() => {
            if (this.socket?.readyState === WebSocket.OPEN) {
                this.socket.send(JSON.stringify({ event: '__ping__' }));
            }
        }, this.heartbeatIntervalMs);
    }

    private stopHeartbeat() {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = undefined;
        }
    }

    private scheduleReconnect() {
        if (this.reconnectTimer) return;
        this.log('[WS] Reconnecting in', this.reconnectIntervalMs, 'ms...');
        this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = undefined;
            this.connect();
        }, this.reconnectIntervalMs);
    }

    private log(...args: any[]) {
        if (this.debug) console.log(...args);
    }

    private logError(...args: any[]) {
        if (this.debug) console.error(...args);
    }
}
