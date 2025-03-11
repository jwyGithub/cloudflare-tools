import type { FetchRequestConfig, FetchResponse, RetryConfig } from './types';
import { defaultRetryConfig } from './fetch';

// 自定义错误类
export class FetchRetryError extends Error {
    constructor(
        public readonly message: string,
        public readonly status?: number,
        public readonly response?: Response,
        public readonly attempt?: number
    ) {
        super(message);
        this.name = 'FetchRetryError';
    }
}

// fetchWithRetry 的配置选项接口
interface FetchWithRetryOptions extends FetchRequestConfig, Partial<RetryConfig> {
    /** 错误回调函数 */
    onError?: (error: Error | FetchRetryError, attempt: number) => void | Promise<void>;
    /** 重试回调函数 */
    onRetry?: (attempt: number, delay: number) => void | Promise<void>;
}

// 常量定义
const MAX_RETRIES = 30;

/**
 * 计算重试延迟时间
 * @param attempt - 当前重试次数
 * @param config - 重试配置
 * @returns 计算后的延迟时间（毫秒）
 */
function calculateDelay(attempt: number, config: Required<FetchWithRetryOptions>): number {
    let delay = config.retryDelay;

    // 应用指数退避
    if (config.exponentialBackoff) {
        delay = delay * 2 ** (attempt - 1);
    }

    // 添加随机因子
    if (config.jitter > 0) {
        const randomization = config.jitter * Math.random();
        delay = delay * (1 + randomization);
    }

    // 确保不超过最大延迟时间
    return Math.min(delay, config.maxRetryDelay);
}

/**
 * 创建超时 Promise
 * @param timeout - 超时时间（毫秒）
 * @returns Promise 对象
 */
function createTimeoutPromise(timeout: number): Promise<never> {
    return new Promise((_, reject) => {
        setTimeout(() => {
            reject(new FetchRetryError(`请求超时 (${timeout}ms)`));
        }, timeout);
    });
}

/**
 * 带重试机制的 fetch 请求函数
 *
 * @example
 * ```typescript
 * // 基本使用
 * const response = await fetchWithRetry('https://api.example.com/data', {
 *     method: 'POST',
 *     body: JSON.stringify({ key: 'value' })
 * });
 *
 * // 自定义重试配置
 * const response = await fetchWithRetry('https://api.example.com/data', {
 *     retries: 3,
 *     retryDelay: 1000,
 *     exponentialBackoff: true,
 *     timeout: 5000,
 *     onRetry: (attempt, delay) => {
 *         console.log(`第 ${attempt} 次重试，延迟 ${delay}ms`);
 *     }
 * });
 *
 * // 使用 Request 对象
 * const request = new Request('https://api.example.com/data');
 * const response = await fetchWithRetry(request);
 * ```
 */
export async function fetchWithRetry(
    input: RequestInfo | URL,
    options: Omit<FetchWithRetryOptions, 'url'> = {}
): Promise<FetchResponse<Response>> {
    // 合并配置并处理重试次数
    const config = {
        ...defaultRetryConfig,
        ...options,
        // 确保重试次数不超过最大限制
        retries: options.retries === Infinity ? MAX_RETRIES : Math.min(options.retries || defaultRetryConfig.retries || 0, MAX_RETRIES)
    } as Required<FetchWithRetryOptions>;

    let attempt = 0;

    const makeRequest = async (): Promise<FetchResponse<Response>> => {
        attempt++;

        try {
            // 处理 Request 对象
            let request: Request;
            let requestUrl: string;

            if (input instanceof Request) {
                requestUrl = input.url;
                // 正确克隆 Request 对象
                const clonedRequest = input.clone() as Request;
                request = new Request(clonedRequest, {
                    ...clonedRequest,
                    ...options
                } as RequestInit);
            } else {
                requestUrl = input.toString();
                request = new Request(requestUrl, options as RequestInit);
            }

            // 创建带超时的请求
            const fetchPromise = fetch(request);
            const timeoutPromise = config.timeout ? createTimeoutPromise(config.timeout) : null;

            // 执行请求
            const response = await (timeoutPromise ? Promise.race([fetchPromise, timeoutPromise]) : fetchPromise);

            // 转换为标准响应格式
            const fetchResponse: FetchResponse<Response> = {
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries()),
                data: response,
                config: { url: requestUrl, ...options },
                ok: response.ok
            };

            // 检查是否需要重试
            const shouldRetry =
                config.retries > 0 &&
                attempt <= config.retries &&
                (typeof config.retryOn === 'function' ? config.retryOn(response) : config.retryOn.includes(response.status));

            if (shouldRetry) {
                const delay = calculateDelay(attempt, config);

                // 调用重试回调
                if (config.onRetry) {
                    await config.onRetry(attempt, delay);
                }

                // 调用错误回调
                if (config.onError) {
                    const error = new FetchRetryError(`请求失败，状态码 ${fetchResponse.status}`, fetchResponse.status, response, attempt);
                    await config.onError(error, attempt);
                }

                // 等待后重试
                await new Promise(resolve => setTimeout(resolve, delay));
                return makeRequest();
            }

            return fetchResponse;
        } catch (error: any) {
            // 包装错误
            const retryError =
                error instanceof FetchRetryError ? error : new FetchRetryError(error.message || '请求失败', undefined, undefined, attempt);

            // 处理错误
            if (config.onError) {
                await config.onError(retryError, attempt);
            }

            // 检查是否可以重试
            if (config.retries > 0 && attempt <= config.retries) {
                const delay = calculateDelay(attempt, config);

                // 调用重试回调
                if (config.onRetry) {
                    await config.onRetry(attempt, delay);
                }

                await new Promise(resolve => setTimeout(resolve, delay));
                return makeRequest();
            }

            throw retryError;
        }
    };

    return makeRequest();
}
