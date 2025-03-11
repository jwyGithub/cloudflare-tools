export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// 定义响应类型枚举
export type ResponseType = 'json' | 'text' | 'blob' | 'arrayBuffer' | 'formData' | 'stream';

// 为流式响应添加专门的类型
export type StreamResponse = ReadableStream<Uint8Array>;

export interface FetchRequestConfig {
    url: string;
    method?: HttpMethod;
    headers?: HeadersInit;
    body?: any;
    params?: Record<string, any>;
    timeout?: number;
    signal?: AbortSignal;
    retries?: number;
    retryDelay?: number;
    retryOn?: number[] | ((response: Response) => boolean);
    // 添加响应类型配置
    responseType?: ResponseType;
}

export interface FetchResponse<T = Response> {
    data: T;
    status: number;
    statusText: string;
    headers: HeadersInit;
    config: FetchRequestConfig;
    ok: boolean;
}

export type FetchInterceptor<T> = (configOrResponse: T) => T | Promise<T>;

// 为重试和超时功能定义专门的接口
export interface RetryConfig {
    /** 最大重试延迟时间（毫秒） */
    maxRetryDelay?: number;
    /** 请求超时时间（毫秒） */
    timeout?: number;
    /** 是否启用指数退避 */
    exponentialBackoff?: boolean;
    /** 随机因子范围 (0-1) */
    jitter?: number;
}

export interface TimeoutConfig {
    timeout?: number;
}

// 组合接口
export interface FetchWithRetryOptions extends FetchRequestConfig, RetryConfig {}
export interface FetchWithTimeoutOptions extends FetchRequestConfig, TimeoutConfig {}
