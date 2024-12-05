import type { FetchRequestConfig, FetchResponse } from './types';
import { defaultRetryConfig, fetch } from '../index';

interface FetchWithRetryOptions extends FetchRequestConfig {
    retries?: number; // 最大重试次数
    retryDelay?: number; // 重试间隔时间（毫秒）
    retryOnStatusCodes?: number[]; // 需要重试的状态码
    onError?: (error: Error, attempt: number) => void | Promise<void>; // 错误回调
}

export async function fetchWithRetry(url: string, options: Omit<FetchWithRetryOptions, 'url'>): Promise<FetchResponse> {
    const {
        retries = defaultRetryConfig.retries,
        retryDelay = defaultRetryConfig.retryDelay,
        retryOnStatusCodes = defaultRetryConfig.retryOnStatusCodes,
        onError,
        ...restOptions
    } = options;
    let attempt = 0;

    const makeRequest = async (): Promise<FetchResponse> => {
        attempt++;
        try {
            const response = await fetch.request({ url, ...restOptions });

            if (retryOnStatusCodes.includes(response.status) && attempt <= retries) {
                if (onError) {
                    const errorResult = onError(new Error(`Request failed with status ${response.status}`), attempt);
                    if (errorResult instanceof Promise) {
                        await errorResult;
                    }
                }
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                return makeRequest();
            }

            return response;
        } catch (error: any) {
            if (onError) {
                const errorResult = onError(error, attempt);
                if (errorResult instanceof Promise) {
                    await errorResult;
                }
            }
            if (attempt <= retries) {
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                return makeRequest();
            }
            throw error;
        }
    };

    return makeRequest();
}
