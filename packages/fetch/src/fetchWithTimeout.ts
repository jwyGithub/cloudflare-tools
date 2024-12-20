import type { FetchRequestConfig, FetchResponse } from './types';

/**
 * fetchWithRetry 的配置选项接口
 * @interface FetchWithRetryOptions
 * @extends {FetchRequestConfig}
 */
interface FetchWithTimeoutOptions extends Omit<FetchRequestConfig, 'url' | 'responseType'> {
    url?: string;
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
export async function fetchWithTimeout(input: RequestInfo | URL, options: FetchWithTimeoutOptions = {}): Promise<FetchResponse<Response>> {
    const { timeout = 0, onTimeout, ...restOptions } = options;
    const controller = new AbortController();
    let timeoutId: number | null = null;

    try {
        if (timeout > 0) {
            timeoutId = setTimeout(() => {
                controller.abort();
                onTimeout?.(new Error('请求超时'));
            }, timeout);
        }

        const response = await fetch(
            new Request(input, {
                ...restOptions,
                signal: controller.signal
            })
        );

        timeoutId && clearTimeout(timeoutId);

        return {
            data: response,
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            config: { url: response.url, ...restOptions },
            ok: response.ok
        };
    } catch (error: any) {
        timeoutId && clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new DOMException('The request timed out', 'TimeoutError');
        }
        throw error;
    }
}
