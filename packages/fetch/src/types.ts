export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface FetchRequestConfig {
    url: string;
    method?: HttpMethod;
    headers?: Record<string, string>;
    body?: any;
    params?: Record<string, any>;
    timeout?: number;
    signal?: AbortSignal; // 添加 signal 属性
    retries?: number;
    retryDelay?: number;
    retryOnStatusCodes?: number[];
}

export interface FetchResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: Headers;
    config: FetchRequestConfig;
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
