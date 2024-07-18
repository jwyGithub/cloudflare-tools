export interface FetchRequestConfig {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Headers;
    params?: Record<string, any>;
    body?: string | FormData | Record<string, any>;
    responseType?: 'json' | 'text' | 'blob';
}

export interface FetchResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: Headers;
    config: FetchRequestConfig;
    request: Response;
}

export type FetchInterceptor<T> = (value: T) => T | Promise<T>;
export type FetchErrorInterceptor = (error: any) => any;
