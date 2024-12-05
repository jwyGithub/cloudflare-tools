export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface FetchRequestConfig {
    url: string;
    method?: HttpMethod;
    headers?: HeadersInit;
    body?: any;
    params?: Record<string, any>;
    timeout?: number;
    signal?: AbortSignal; // 添加 signal 属性
    retries?: number;
    retryDelay?: number;
    retryOnStatusCodes?: number[];
}

export interface FetchResponse {
    data: Response;
    status: number;
    statusText: string;
    headers: HeadersInit;
    config: FetchRequestConfig;
    ok: boolean;
}

export type FetchInterceptor<T> = (configOrResponse: T) => T | Promise<T>;

// 为重试和超时功能定义专门的接口
export interface RetryConfig {
    retries?: number;
    retryDelay?: number;
    retryOnStatusCodes?: number[];
}

export interface TimeoutConfig {
    timeout?: number;
}

// 组合接口
export interface FetchWithRetryOptions extends FetchRequestConfig, RetryConfig {}
export interface FetchWithTimeoutOptions extends FetchRequestConfig, TimeoutConfig {}
