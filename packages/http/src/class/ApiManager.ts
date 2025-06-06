import { ApiManagerErrors } from '../types/ApiManagerErrors';
import { ApiManagerOptions, AuthConfig, DataFormat } from '../types/ApiManagerOptions';

export const Errors = ApiManagerErrors;

type ErrorListener = (error: any) => void;

export class ApiManager {
    private baseUrl: string;
    private format: DataFormat;
    private auth: AuthConfig;
    private agent: any;
    private throwErrors: boolean;
    private listeners: { [key: string]: ErrorListener[] } = {};

    constructor(options: ApiManagerOptions) {
        this.baseUrl = options.baseUrl;
        this.format = options.format || 'json';
        this.auth = options.auth || { type: 'cookie', credentials: 'include' };
        this.throwErrors = options.throwErrors ?? true;
    }

    on(event: ApiManagerErrors, listener: ErrorListener) {
        this.listeners[event] = this.listeners[event] || [];
        this.listeners[event].push(listener);
    }

    private emit(event: ApiManagerErrors, payload: any) {
        (this.listeners[event] || []).forEach((fn) => fn(payload));
    }

    private normalizeUrl(endpoint: string): string {
        let base = this.baseUrl;
        if (base.endsWith('/') && endpoint.startsWith('/')) {
            endpoint = endpoint.replace(/^\/+/, '');
        } else if (!base.endsWith('/') && !endpoint.startsWith('/')) {
            endpoint = '/' + endpoint;
        }
        return base + endpoint;
    }

    private getHeaders(): Headers {
        const headers = new Headers();
        if (this.auth.type === 'bearer') {
            headers.set('Authorization', `Bearer ${this.auth.token}`);
        }

        if (this.format === 'json') {
            headers.set('Content-Type', 'application/json');
            headers.set('Accept', 'application/json');
        } else if (this.format === 'xml') {
            headers.set('Accept', 'application/xml');
        }

        return headers;
    }

    private async request<T = any>(
        method: string,
        endpoint: string,
        body?: Record<string, any>,
        params?: Record<string, any>,
    ): Promise<{ data: T }> {
        const url = new URL(this.normalizeUrl(endpoint));

        if (params) {
            Object.entries(params).forEach(([key, val]) => {
                if (val !== undefined) url.searchParams.append(key, String(val));
            });
        }

        const headers = this.getHeaders();
        const options: RequestInit = {
            method,
            headers,
        };

        if (this.format === 'xml' && body && typeof body !== 'string') {
            throw new Error('XML body must be a string. Use a serializer before sending.');
        }

        if (body && this.format === 'json') {
            options.body = JSON.stringify(body);
        } else if (body) {
            options.body = body as any;
        }

        if (this.agent) {
            (options as any).agent = this.agent;
        }

        if (this.auth.type === 'cookie') {
            options.credentials = this.auth.credentials || 'include';
        }

        try {
            const res = await fetch(url.toString(), options);
            if (!res.ok) {
                const errorPayload = { status: res.status, statusText: res.statusText };
                this.emit(ApiManagerErrors.HttpError, errorPayload);
            }

            if (this.format === 'json') {
                const data = await res.json();
                return { data: data as T };
            }

            if (this.format === 'xml') {
                const text = await res.text();
                return { data: text as any };
            }

            if (this.format === 'binary') {
                const buffer = await res.arrayBuffer();
                return { data: buffer as any };
            }

            return { data: {} as any };
        } catch (err) {
            this.emit(ApiManagerErrors.Error, err);
            if (this.throwErrors) {
                throw err;
            } else {
                return { data: {} as any };
            }
        }
    }

    get<T = any>(endpoint: string, params?: Record<string, any>) {
        return this.request<T>('GET', endpoint, undefined, params);
    }

    post<T = any>(endpoint: string, body?: Record<string, any>) {
        return this.request<T>('POST', endpoint, body);
    }

    put<T = any>(endpoint: string, body?: Record<string, any>) {
        return this.request<T>('PUT', endpoint, body);
    }

    patch<T = any>(endpoint: string, body?: Record<string, any>) {
        return this.request<T>('PATCH', endpoint, body);
    }

    delete<T = any>(endpoint: string, params?: Record<string, any>) {
        return this.request<T>('DELETE', endpoint, undefined, params);
    }

    options<T = any>(endpoint: string, params?: Record<string, any>) {
        return this.request<T>('OPTIONS', endpoint, undefined, params);
    }

    head<T = any>(endpoint: string, params?: Record<string, any>) {
        return this.request<T>('HEAD', endpoint, undefined, params);
    }
}
