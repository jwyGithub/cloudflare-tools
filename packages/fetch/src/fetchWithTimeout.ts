import type { FetchRequestConfig, FetchResponse } from './types';
import { defaultTimeoutConfig } from './fetch';

/**
 * fetchWithRetry 的配置选项接口
 * @interface FetchWithRetryOptions
 * @extends {FetchRequestConfig}
 */
interface FetchWithTimeoutOptions extends FetchRequestConfig {
    /** 超时时间（毫秒） */
    timeout?: number;
    /**
     * 超时回调函数
     * @param error - 捕获到的错误
     */
    onTimeout?: (error: Error) => void | Promise<void>;
}

/**
 * 带超时机制的 fetch 请求函数
 *
 * @example
 * ```typescript
 * // 基本使用 - URL + 选项方式
 * const response = await fetchWithTimeout('https://api.example.com/data', {
 *     method: 'POST',
 *     body: JSON.stringify({ key: 'value' })
 * });
 *
 * // 使用 Request 对象
 * const request = new Request('https://api.example.com/data', {
 *     method: 'POST',
 *     body: JSON.stringify({ key: 'value' })
 * });
 * const response = await fetchWithTimeout(request, {
 *     timeout: 5000 // 5秒超时
 * });
 *
 * // 自定义超时时间
 * const response = await fetchWithTimeout('https://api.example.com/data', {
 *     timeout: 5000,
 *     headers: {
 *         'Content-Type': 'application/json'
 *     }
 * });
 * ```
 *
 * @param input - 请求的 URL 或 Request 对象
 * @param options - 请求配置选项，包含超时设置
 * @returns Promise<FetchResponse> 返回处理后的响应对象
 * @throws {Error} 当请求超时时抛出超时错误
 */
export async function fetchWithTimeout(
    input: RequestInfo | URL,
    options: Omit<FetchWithTimeoutOptions, 'url'> = defaultTimeoutConfig
): Promise<FetchResponse> {
    const { timeout = defaultTimeoutConfig.timeout, onTimeout, ...restOptions } = options;

    const controller = new AbortController();
    const signal = options.signal || controller.signal;

    let timeoutId: number | undefined;
    if (timeout > 0) {
        timeoutId = setTimeout(() => {
            controller.abort(new DOMException('Timeout', 'TimeoutError'));
            onTimeout?.(new Error('请求超时'));
        }, timeout);
    }

    try {
        // 处理 Request 对象的情况
        let request: Request;
        let requestUrl: string;

        if (input instanceof Request) {
            requestUrl = input.url;
            request = new Request(input, {
                ...restOptions,
                signal
            });
        } else {
            requestUrl = input.toString();
            request = new Request(requestUrl, {
                ...restOptions,
                signal
            });
        }

        const response = await fetch(request);
        timeoutId && clearTimeout(timeoutId);

        const fetchResponse: FetchResponse = {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries()),
            data: await response.json(),
            config: { url: requestUrl, ...restOptions },
            ok: response.ok
        };

        return fetchResponse;
    } catch (error: any) {
        timeoutId && clearTimeout(timeoutId);
        if (error.name === 'TimeoutError') {
            throw new DOMException('The request timed out', 'TimeoutError');
        }
        throw error;
    }
}
