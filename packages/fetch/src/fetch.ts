import type { FetchInterceptor, FetchRequestConfig, FetchResponse } from './types';

export const defaultRetryConfig = {
    retries: 3, // 默认最大重试次数
    retryDelay: 1000, // 默认每次重试的间隔时间（毫秒）
    retryOnStatusCodes: [500, 502, 503, 504] // 默认重试的状态码
};

export class FetchClient {
    private requestInterceptors: FetchInterceptor<FetchRequestConfig>[] = [];
    private responseInterceptors: FetchInterceptor<FetchResponse>[] = [];

    // 添加请求拦截器
    useRequestInterceptor(interceptor: FetchInterceptor<FetchRequestConfig>) {
        this.requestInterceptors.push(interceptor);
    }

    // 添加响应拦截器
    useResponseInterceptor(interceptor: FetchInterceptor<FetchResponse>) {
        this.responseInterceptors.push(interceptor);
    }

    // 核心请求方法
    async request(config: FetchRequestConfig & { retries?: number; retryDelay?: number; timeout?: number }): Promise<FetchResponse> {
        let finalConfig = { ...config };

        // 将默认重试配置合并到请求配置中
        finalConfig.retries = finalConfig.retries ?? defaultRetryConfig.retries;
        finalConfig.retryDelay = finalConfig.retryDelay ?? defaultRetryConfig.retryDelay;

        // 应用请求拦截器
        for (const interceptor of this.requestInterceptors) {
            finalConfig = await interceptor(finalConfig);
        }

        // 处理 URL 上的查询参数
        if (finalConfig.params) {
            const queryString = new URLSearchParams(finalConfig.params).toString();
            finalConfig.url += (finalConfig.url.includes('?') ? '&' : '?') + queryString;
        }

        // 设置默认的请求方法
        finalConfig.method = finalConfig.method || 'GET';

        const { timeout = 10000 } = finalConfig; // 默认超时时间10秒
        let attempt = 0;

        const controller = new AbortController();
        const signal = config.signal || controller.signal;

        const makeRequest = async (): Promise<FetchResponse> => {
            attempt++;

            // 启动超时计时器
            const timeoutId = setTimeout(() => {
                controller.abort();
            }, timeout);

            try {
                const response = await fetch(finalConfig.url, {
                    method: finalConfig.method,
                    headers: finalConfig.headers,
                    body: finalConfig.body ? JSON.stringify(finalConfig.body) : undefined,
                    signal
                });

                clearTimeout(timeoutId);

                const responseData: FetchResponse = {
                    data: response,
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers,
                    config: finalConfig,
                    ok: response.ok
                };

                // 应用响应拦截器
                let finalResponse = responseData;
                for (const interceptor of this.responseInterceptors) {
                    finalResponse = await interceptor(finalResponse);
                }

                if (!response.ok && !!finalConfig.retries && attempt < finalConfig.retries) {
                    await new Promise(resolve => setTimeout(resolve, finalConfig.retryDelay));
                    return makeRequest();
                }

                return finalResponse;
            } catch (error: any) {
                if (error.name === 'AbortError') {
                    throw new Error('Request timed out');
                }

                if (!!finalConfig.retries && attempt < finalConfig.retries) {
                    await new Promise(resolve => setTimeout(resolve, finalConfig.retryDelay));
                    return makeRequest();
                }

                throw error;
            }
        };

        return makeRequest();
    }
    /**
     * 使用示例：
     * ```typescript
     * // 基本使用
     * const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
     * console.log(response.data);
     *
     * // 带参数的请求
     * const responseWithParams = await axios.get('https://jsonplaceholder.typicode.com/posts', {
     *   params: { userId: 1 },
     * });
     * console.log(responseWithParams.data);
     * ```
     */

    get(url: string, config?: Omit<FetchRequestConfig, 'method' | 'url'>): Promise<FetchResponse> {
        return this.request({ ...config, url, method: 'GET' });
    }

    /**
     * 使用示例：
     * ```typescript
     * // 基本使用
     * const response = await axios.post('https://jsonplaceholder.typicode.com/posts', {
     *   title: 'foo',
     *   body: 'bar',
     *   userId: 1,
     * });
     * console.log(response.data);
     *
     * // 带参数的请求
     * const responseWithParams = await axios.post('https://jsonplaceholder.typicode.com/posts', {
     *   title: 'foo',
     *   body: 'bar',
     * }, {
     *   params: { userId: 1 },
     * });
     * console.log(responseWithParams.data);
     * ```
     */

    post(url: string, body?: any, config?: Omit<FetchRequestConfig, 'method' | 'url' | 'body'>): Promise<FetchResponse> {
        return this.request({ ...config, url, method: 'POST', body });
    }

    /**
     * 使用示例：
     * ```typescript
     * // 基本使用
     * const response = await axios.put('https://jsonplaceholder.typicode.com/posts/1', {
     *   title: 'foo',
     *   body: 'bar',
     *   userId: 1,
     * });
     * console.log(response.data);
     *
     * // 带参数的请求
     * const responseWithParams = await axios.put('https://jsonplaceholder.typicode.com/posts/1', {
     *   title: 'foo',
     *   body: 'bar',
     * }, {
     *   params: { admin: true },
     * });
     * console.log(responseWithParams.data);
     * ```
     */
    put(url: string, body?: any, config?: Omit<FetchRequestConfig, 'method' | 'url' | 'body'>): Promise<FetchResponse> {
        return this.request({ ...config, url, method: 'PUT', body });
    }

    /**
     * 使用示例：
     * ```typescript
     * // 基本使用
     * const response = await axios.delete('https://jsonplaceholder.typicode.com/posts/1');
     * console.log(response.data);
     *
     * // 带参数的请求
     * const responseWithParams = await axios.delete('https://jsonplaceholder.typicode.com/posts', {
     *   params: { userId: 1 },
     * });
     * console.log(responseWithParams.data);
     * ```
     */
    delete(url: string, config?: Omit<FetchRequestConfig, 'method' | 'url'>): Promise<FetchResponse> {
        return this.request({ ...config, url, method: 'DELETE' });
    }
}
