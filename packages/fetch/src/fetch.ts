import type { FetchInterceptor, FetchRequestConfig, FetchResponse, HttpMethod, StreamResponse } from './types';

/** 默认重试配置 */
export const defaultRetryConfig = {
    retries: 0,
    retryDelay: 1000,
    maxRetryDelay: 30000,
    timeout: 10000,
    retryOn: [408, 429, 500, 502, 503, 504],
    exponentialBackoff: true,
    jitter: 0.1
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
    private responseInterceptors: FetchInterceptor<FetchResponse<any>>[] = [];

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
    useResponseInterceptor(interceptor: FetchInterceptor<FetchResponse<any>>) {
        this.responseInterceptors.push(interceptor);
    }

    /**
     * 核心请求方法
     * @param input - URL 字符串、URL 对象或 Request 对象
     * @param config - 请求配置
     */
    async request<T = any>(
        input: RequestInfo | URL | FetchRequestConfig,
        config: Partial<FetchRequestConfig> = {}
    ): Promise<FetchResponse<T>> {
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

        // 合并认配置
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

        const makeRequest = async (): Promise<FetchResponse<T>> => {
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

                // 根据 responseType 处理响应数据
                let data: any;
                switch (finalConfig.responseType) {
                    case 'text':
                        data = await response.text();
                        break;
                    case 'blob':
                        data = await response.blob();
                        break;
                    case 'arrayBuffer':
                        data = await response.arrayBuffer();
                        break;
                    case 'formData':
                        data = await response.formData();
                        break;
                    case 'stream':
                        if (!response.body) {
                            throw new Error('Response body is null');
                        }
                        data = response.body;
                        break;
                    case 'json':
                    default:
                        data = await response.json();
                        break;
                }

                const responseData: FetchResponse<T> = {
                    data,
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
     * // 带类型的 JSON 响应
     * interface User { id: number; name: string }
     * const user = await client.get<User>('https://api.example.com/user/1');
     *
     * // 获取文本响应
     * const text = await client.get<string>('https://api.example.com/text', {
     *     responseType: 'text'
     * });
     * ```
     */
    get<T = any>(input: RequestInfo | URL, config?: Omit<FetchRequestConfig, 'method' | 'url'>): Promise<FetchResponse<T>> {
        return this.request<T>(input, { ...config, method: 'GET' });
    }

    /**
     * POST 请求
     * @example
     * ```typescript
     * // 发送和接收 JSON 数据
     * interface CreateUserRequest { name: string; age: number }
     * interface CreateUserResponse { id: number; name: string }
     *
     * const response = await client.post<CreateUserResponse, CreateUserRequest>(
     *     '/api/users',
     *     { name: 'John', age: 30 }
     * );
     *
     * // 上传文件并接收 JSON 响应
     * const formData = new FormData();
     * formData.append('file', file);
     * const response = await client.post<UploadResponse, FormData>(
     *     '/api/upload',
     *     formData,
     *     { responseType: 'json' }
     * );
     * ```
     */
    post<TResponse = any, TBody = any>(
        input: RequestInfo | URL,
        body?: TBody,
        config?: Omit<FetchRequestConfig, 'method' | 'url' | 'body'>
    ): Promise<FetchResponse<TResponse>> {
        return this.request<TResponse>(input, { ...config, method: 'POST', body });
    }

    /**
     * PUT 请求
     * @example
     * ```typescript
     * // 更新资源
     * interface UpdateUserRequest { name: string }
     * interface UpdateUserResponse { id: number; name: string }
     *
     * const response = await client.put<UpdateUserResponse, UpdateUserRequest>(
     *     '/api/users/1',
     *     { name: 'New Name' }
     * );
     * ```
     */
    put<TResponse = any, TBody = any>(
        input: RequestInfo | URL,
        body?: TBody,
        config?: Omit<FetchRequestConfig, 'method' | 'url' | 'body'>
    ): Promise<FetchResponse<TResponse>> {
        return this.request<TResponse>(input, { ...config, method: 'PUT', body });
    }

    /**
     * DELETE 请求
     * @example
     * ```typescript
     * // 基本删除
     * const response = await client.delete('/api/users/1');
     *
     * // 带响应类型的删除
     * interface DeleteResponse { success: boolean }
     * const response = await client.delete<DeleteResponse>('/api/users/1');
     * ```
     */
    delete<T = any>(input: RequestInfo | URL, config?: Omit<FetchRequestConfig, 'method' | 'url'>): Promise<FetchResponse<T>> {
        return this.request<T>(input, { ...config, method: 'DELETE' });
    }

    /**
     * PATCH 请求
     * @example
     * ```typescript
     * // 部分更新
     * interface PatchUserRequest { name?: string; age?: number }
     * interface PatchUserResponse { id: number; name: string; age: number }
     *
     * const response = await client.patch<PatchUserResponse, PatchUserRequest>(
     *     '/api/users/1',
     *     { age: 31 }
     * );
     * ```
     */
    patch<TResponse = any, TBody = any>(
        input: RequestInfo | URL,
        body?: TBody,
        config?: Omit<FetchRequestConfig, 'method' | 'url' | 'body'>
    ): Promise<FetchResponse<TResponse>> {
        return this.request<TResponse>(input, { ...config, method: 'PATCH', body });
    }

    /**
     * 发送请求并返回 JSON 数据
     * @example
     * ```typescript
     * // 带类型提示的 JSON 响应
     * interface User { id: number; name: string }
     * const user = await client.fetchJson<User>('https://api.example.com/user/1');
     * console.log(user.data.name); // 类型安全
     * ```
     */
    async fetchJson<T = any>(input: RequestInfo | URL, config?: Omit<FetchRequestConfig, 'url'>): Promise<FetchResponse<T>> {
        const response = await this.request(input, {
            ...config,
            headers: {
                Accept: 'application/json',
                ...config?.headers
            }
        });
        return response as FetchResponse<T>;
    }

    /**
     * 发送请求并返回 Blob 数据
     * @example
     * ```typescript
     * // 下载文件
     * const blob = await client.fetchBlob('https://example.com/file.pdf');
     * const url = URL.createObjectURL(blob.data);
     * ```
     */
    async fetchBlob(input: RequestInfo | URL, config?: Omit<FetchRequestConfig, 'url'>): Promise<FetchResponse<Blob>> {
        const response = await fetch(new Request(input, config));
        const blob = await response.blob();
        return {
            data: blob,
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries()),
            config: { url: response.url, ...config },
            ok: response.ok
        };
    }

    /**
     * 发送请求并返回文本数据
     * @example
     * ```typescript
     * // 获取文本内容
     * const text = await client.fetchText('https://example.com/readme.txt');
     * console.log(text.data);
     * ```
     */
    async fetchText(input: RequestInfo | URL, config?: Omit<FetchRequestConfig, 'url'>): Promise<FetchResponse<string>> {
        const response = await fetch(new Request(input, config));
        const text = await response.text();
        return {
            data: text,
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries()),
            config: { url: response.url, ...config },
            ok: response.ok
        };
    }

    /**
     * 发送请求并返回 ArrayBuffer 数据
     * @example
     * ```typescript
     * // 处理二进制数据
     * const buffer = await client.fetchArrayBuffer('https://example.com/data.bin');
     * const view = new DataView(buffer.data);
     * ```
     */
    async fetchArrayBuffer(input: RequestInfo | URL, config?: Omit<FetchRequestConfig, 'url'>): Promise<FetchResponse<ArrayBuffer>> {
        const response = await fetch(new Request(input, config));
        const buffer = await response.arrayBuffer();
        return {
            data: buffer,
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries()),
            config: { url: response.url, ...config },
            ok: response.ok
        };
    }

    /**
     * 发送请求并返回 FormData 数据
     * @example
     * ```typescript
     * // 获取表单数据
     * const form = await client.fetchFormData('https://example.com/form');
     * const field = form.data.get('fieldName');
     * ```
     */
    async fetchFormData(input: RequestInfo | URL, config?: Omit<FetchRequestConfig, 'url'>): Promise<FetchResponse<FormData>> {
        const response = await fetch(new Request(input, config));
        const formData = await response.formData();
        return {
            data: formData,
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries()),
            config: { url: response.url, ...config },
            ok: response.ok
        };
    }

    /**
     * 发送请求并返回流数据
     * @example
     * ```typescript
     * // 处理流式数据
     * const stream = await client.fetchStream('https://example.com/large-file');
     * const reader = stream.data.getReader();
     * while (true) {
     *   const { done, value } = await reader.read();
     *   if (done) break;
     *   // 处理 value (Uint8Array)
     * }
     * ```
     */
    async fetchStream(input: RequestInfo | URL, config?: Omit<FetchRequestConfig, 'url'>): Promise<FetchResponse<StreamResponse>> {
        const response = await fetch(new Request(input, config));
        if (!response.body) {
            throw new Error('Response body is null');
        }

        return {
            data: response.body,
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries()),
            config: { url: response.url, ...config },
            ok: response.ok
        };
    }
}
