import type { FetchInterceptor, FetchRequestConfig, FetchResponse, HttpMethod } from './types';

/** 默认重试配置 */
export const defaultRetryConfig = {
    /** 默认不启用重试 */
    retries: 0,
    /** 默认重试间隔（毫秒） */
    retryDelay: 1000,
    /** 默认需要重试的状态码 */
    retryOnStatusCodes: [500, 502, 503, 504]
};

/** 默认超时配置 */
export const defaultTimeoutConfig = {
    /** 默认不启用超时 */
    timeout: 0
};

/**
 * Fetch 客户端类，提供拦截器、重试、超时等功能
 *
 * @example
 * ```typescript
 * // 创建实例
 * const client = new FetchClient();
 *
 * // 添加请求拦截器
 * client.useRequestInterceptor(config => {
 *     config.headers = {
 *         ...config.headers,
 *         'Authorization': 'Bearer token'
 *     };
 *     return config;
 * });
 *
 * // 添加响应拦截器
 * client.useResponseInterceptor(response => {
 *     if (!response.ok) {
 *         throw new Error(`请求失败: ${response.status}`);
 *     }
 *     return response;
 * });
 *
 * // 基本请求
 * const response = await client.request('https://api.example.com/data');
 *
 * // 带配置的请求
 * const response = await client.request('https://api.example.com/data', {
 *     method: 'POST',
 *     body: { key: 'value' },
 *     timeout: 5000,
 *     retries: 3
 * });
 *
 * // 使用 Request 对象
 * const request = new Request('https://api.example.com/data', {
 *     method: 'POST',
 *     body: JSON.stringify({ key: 'value' })
 * });
 * const response = await client.request(request);
 * ```
 */
export class FetchClient {
    /** 请求拦截器数组 */
    private requestInterceptors: FetchInterceptor<FetchRequestConfig & { retries: number }>[] = [];
    /** 响应拦截器数组 */
    private responseInterceptors: FetchInterceptor<FetchResponse>[] = [];

    /**
     * 添加请求拦截器
     * @param interceptor - 请求拦截器函数
     */
    useRequestInterceptor(interceptor: FetchInterceptor<FetchRequestConfig & { retries: number }>) {
        this.requestInterceptors.push(interceptor);
    }

    /**
     * 添加响应拦截器
     * @param interceptor - 响应拦截器函数
     */
    useResponseInterceptor(interceptor: FetchInterceptor<FetchResponse>) {
        this.responseInterceptors.push(interceptor);
    }

    /**
     * 核心请求方法
     * @param input - URL 字符串、URL 对象或 Request 对象
     * @param config - 请求配置
     */
    async request(
        input: RequestInfo | URL | FetchRequestConfig,
        config: Partial<FetchRequestConfig> & { retries?: number; retryDelay?: number; timeout?: number } = {}
    ): Promise<FetchResponse> {
        // 处理输入参数
        let finalConfig: FetchRequestConfig & {
            retries: number;
            retryDelay?: number;
            timeout?: number;
        };
        let requestUrl: string;

        if (input instanceof Request) {
            requestUrl = input.url;
            finalConfig = {
                ...config,
                retries: defaultRetryConfig.retries,
                url: requestUrl,
                method: (input.method || 'GET') as HttpMethod,
                headers: Object.fromEntries(input.headers.entries())
            };
        } else if (typeof input === 'string' || input instanceof URL) {
            requestUrl = input.toString();
            finalConfig = {
                ...config,
                retries: defaultRetryConfig.retries,
                url: requestUrl
            };
        } else {
            requestUrl = input.url;
            finalConfig = {
                ...input,
                ...config,
                retries: config.retries ?? defaultRetryConfig.retries
            };
        }

        // 合并��认配置
        finalConfig.retries = finalConfig.retries ?? defaultRetryConfig.retries;
        finalConfig.retryDelay = finalConfig.retryDelay ?? defaultRetryConfig.retryDelay;
        finalConfig.timeout = finalConfig.timeout ?? defaultTimeoutConfig.timeout;
        finalConfig.method = finalConfig.method || 'GET';

        // 应用请求拦截器
        for (const interceptor of this.requestInterceptors) {
            finalConfig = await interceptor(finalConfig);
        }

        // 处理查询参数
        if (finalConfig.params) {
            const queryString = new URLSearchParams(finalConfig.params).toString();
            finalConfig.url += (finalConfig.url.includes('?') ? '&' : '?') + queryString;
        }

        let attempt = 0;
        const controller = new AbortController();
        const signal = config.signal || controller.signal;

        const makeRequest = async (): Promise<FetchResponse> => {
            attempt++;

            let timeoutId: number | undefined;

            if (finalConfig.timeout && finalConfig.timeout > 0) {
                timeoutId = setTimeout(() => {
                    controller.abort();
                }, finalConfig.timeout);
            }

            try {
                const request = new Request(finalConfig.url, {
                    method: finalConfig.method,
                    headers: finalConfig.headers,
                    body: finalConfig.body ? JSON.stringify(finalConfig.body) : undefined,
                    signal
                });

                const response = await fetch(request);
                timeoutId && clearTimeout(timeoutId);

                const responseData: FetchResponse = {
                    data: await response.json(),
                    status: response.status,
                    statusText: response.statusText,
                    headers: Object.fromEntries(response.headers.entries()),
                    config: finalConfig,
                    ok: response.ok
                };

                // 应用响应拦截器
                let finalResponse = responseData;
                for (const interceptor of this.responseInterceptors) {
                    finalResponse = await interceptor(finalResponse);
                }

                // 仅在 retries > 0 时启用重试
                if (!response.ok && finalConfig.retries > 0 && attempt < finalConfig.retries) {
                    await new Promise(resolve => setTimeout(resolve, finalConfig.retryDelay));
                    return makeRequest();
                }

                return finalResponse;
            } catch (error: any) {
                timeoutId && clearTimeout(timeoutId);
                if (error.name === 'AbortError') {
                    throw new Error('请求超时');
                }

                // 仅在 retries > 0 时启用重试
                if (finalConfig.retries > 0 && attempt < finalConfig.retries) {
                    await new Promise(resolve => setTimeout(resolve, finalConfig.retryDelay));
                    return makeRequest();
                }

                throw error;
            }
        };

        return makeRequest();
    }

    /**
     * GET 请求
     * @example
     * ```typescript
     * // 基本 GET 请求
     * const response = await client.get('https://api.example.com/data');
     *
     * // 带查询参数
     * const response = await client.get('https://api.example.com/data', {
     *     params: { id: 1 },
     *     headers: { 'Accept': 'application/json' }
     * });
     * ```
     */
    get(input: RequestInfo | URL, config?: Omit<FetchRequestConfig, 'method' | 'url'>): Promise<FetchResponse> {
        return this.request(input, { ...config, method: 'GET' });
    }

    /**
     * POST 请求
     * @example
     * ```typescript
     * // 发送 JSON 数据
     * const response = await client.post('https://api.example.com/data', {
     *     name: 'test',
     *     value: 123
     * });
     *
     * // 带额外配置
     * const response = await client.post('https://api.example.com/data',
     *     { key: 'value' },
     *     { timeout: 5000 }
     * );
     * ```
     */
    post(input: RequestInfo | URL, body?: any, config?: Omit<FetchRequestConfig, 'method' | 'url' | 'body'>): Promise<FetchResponse> {
        return this.request(input, { ...config, method: 'POST', body });
    }

    /**
     * PUT 请求
     * @example
     * ```typescript
     * // 基本使用
     * const response = await client.put('https://api.example.com/data/1', {
     *     name: 'updated',
     *     value: 456
     * });
     *
     * // 带额外配置
     * const response = await client.put('https://api.example.com/data/1',
     *     { status: 'active' },
     *     {
     *         headers: { 'Content-Type': 'application/json' },
     *         timeout: 5000
     *     }
     * );
     * ```
     */
    put(input: RequestInfo | URL, body?: any, config?: Omit<FetchRequestConfig, 'method' | 'url' | 'body'>): Promise<FetchResponse> {
        return this.request(input, { ...config, method: 'PUT', body });
    }

    /**
     * DELETE 请求
     * @example
     * ```typescript
     * // 基本使用
     * const response = await client.delete('https://api.example.com/data/1');
     *
     * // 带查询参数和配置
     * const response = await client.delete('https://api.example.com/data', {
     *     params: { id: 1 },
     *     headers: { 'Authorization': 'Bearer token' },
     *     timeout: 5000
     * });
     * ```
     */
    delete(input: RequestInfo | URL, config?: Omit<FetchRequestConfig, 'method' | 'url'>): Promise<FetchResponse> {
        return this.request(input, { ...config, method: 'DELETE' });
    }
}
