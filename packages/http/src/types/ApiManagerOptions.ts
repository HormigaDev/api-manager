export type DataFormat = 'json' | 'xml' | 'binary';
export type AuthConfig =
    | { type: 'bearer'; token: string }
    | { type: 'cookie'; credentials?: 'omit' | 'include' | 'same-origin' };

export interface ApiManagerOptions {
    baseUrl: string;
    format?: DataFormat;
    auth?: AuthConfig;
    agent?: any;
    throwErrors?: boolean;
    headers?: Record<string, string>;
}
