import type { FetchRequestConfig, FetchResponse } from './types';
import { defaultRetryConfig, fetch } from '../index';

interface FetchWithRetryOptions extends FetchRequestConfig {
    retries?: number; // 最大重试次数
    retryDelay?: number; // 重试间隔时间（毫秒）
    retryOnStatusCodes?: number[]; // 需要重试的状态码
}

export async function fetchWithRetry<T>(url: string, options: Omit<FetchWithRetryOptions, 'url'>): Promise<FetchResponse<T>> {
    const {
        retries = defaultRetryConfig.retries,
        retryDelay = defaultRetryConfig.retryDelay,
        retryOnStatusCodes = defaultRetryConfig.retryOnStatusCodes,
        ...restOptions
    } = options;
    let attempt = 0;

    const makeRequest = async (): Promise<FetchResponse<T>> => {
        attempt++;
        try {
            const response = await fetch.request<T>({ url, ...restOptions });

            if (retryOnStatusCodes.includes(response.status) && attempt < retries) {
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                return makeRequest();
            }

            return response;
        } catch (error) {
            if (attempt < retries) {
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                return makeRequest();
            }
            throw error;
        }
    };

    return makeRequest();
}
