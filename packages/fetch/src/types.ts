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

export interface FetchResponse<T = any> {
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
    /** 最大重试次数 */
    retries?: number;
    /** 重试间隔时间（毫秒） */
    retryDelay?: number;
    /** 需要重试的 HTTP 状态码数组 */
    retryOn?: number[] | ((response: Response) => boolean);
}

export interface TimeoutConfig {
    timeout?: number;
}

// 组合接口
export interface FetchWithRetryOptions extends FetchRequestConfig, RetryConfig {}
export interface FetchWithTimeoutOptions extends FetchRequestConfig, TimeoutConfig {}
