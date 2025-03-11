import type { FetchRequestConfig, FetchResponse } from './types';
import { defaultRetryConfig } from '../index';

/**
 * fetchWithRetry 的配置选项接口
 * @interface FetchWithRetryOptions
 * @extends {FetchRequestConfig}
 */
interface FetchWithRetryOptions extends FetchRequestConfig {
    /**
     * 错误回调函数
     * @param error - 捕获到的错误
     * @param attempt - 当前重试次数
     */
    onError?: (error: Error, attempt: number) => void | Promise<void>;
}

/**
 * 带重试机制的 fetch 请求函数
 *
 * @example
 * ```typescript
 * // 基本使用 - URL + 选项方式
 * const response = await fetchWithRetry('https://api.example.com/data', {
 *     method: 'POST',
 *     body: JSON.stringify({ key: 'value' })
 * });
 *
 * // 使用 Request 对象
 * const request = new Request('https://api.example.com/data', {
 *     method: 'POST',
 *     body: JSON.stringify({ key: 'value' })
 * });
 * const response = await fetchWithRetry(request, {
 *     retries: 3,
 *     retryDelay: 1000
 * });
 *
 * // 自定义重试配置
 * const response = await fetchWithRetry('https://api.example.com/data', {
 *     retries: 3,
 *     retryDelay: 1000,
 *     retryOnStatusCodes: [500, 502, 503],
 *     onError: (error, attempt) => {
 *         console.log(`第 ${attempt} 次重试失败:`, error);
 *     }
 * });
 * ```
 *
 * @param input - 请求的 URL 或 Request 对象
 * @param options - 请求配置选项，包含重试相关配置
 * @returns Promise<FetchResponse> 返回处理后的响应对象
 */
export async function fetchWithRetry(
    input: RequestInfo | URL,
    options: Omit<FetchWithRetryOptions, 'url'> = defaultRetryConfig
): Promise<FetchResponse<Response>> {
    const {
        retries = defaultRetryConfig.retries,
        retryDelay = defaultRetryConfig.retryDelay,
        retryOn = defaultRetryConfig.retryOn,
        onError,
        ...restOptions
    } = options;
    let attempt = 0;

    const makeRequest = async (): Promise<FetchResponse> => {
        attempt++;
        try {
            // 处理 Request 对象的情况
            let request: Request;
            let requestUrl: string;

            if (input instanceof Request) {
                requestUrl = input.url;
                // 克隆 Request 对象，因为 Request 对象只能使用一次
                request = new Request(input, restOptions);
            } else {
                requestUrl = input.toString();
                request = new Request(requestUrl, restOptions);
            }

            // 发起请求
            const response = await fetch(request);

            // 转换为标准响应格式
            const fetchResponse: FetchResponse<Response> = {
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries()),
                data: response,
                config: { url: requestUrl, ...restOptions },
                ok: response.ok
            };

            // 检查是否需要重试
            const shouldRetry = typeof retryOn === 'function' ? retryOn(response) : retryOn.includes(fetchResponse.status);
            if (shouldRetry && attempt <= retries) {
                if (onError) {
                    const errorResult = onError(new Error(`请求失败，状态码 ${fetchResponse.status}`), attempt);
                    if (errorResult instanceof Promise) {
                        await errorResult;
                    }
                }
                // 等待指定时间后重试
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                return makeRequest();
            }

            return fetchResponse;
        } catch (error: any) {
            // 处理请求错误
            if (onError) {
                const errorResult = onError(error, attempt);
                if (errorResult instanceof Promise) {
                    await errorResult;
                }
            }
            // 如果未超过最大重试次数，则重试
            if (attempt <= retries) {
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                return makeRequest();
            }
            throw error;
        }
    };

    return makeRequest();
}
