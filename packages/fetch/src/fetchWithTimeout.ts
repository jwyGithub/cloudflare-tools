import type { FetchResponse, FetchWithTimeoutOptions } from './types';
import { fetch } from '../index';

const DEFAULT_TIMEOUT = 10000; // 默认超时时间为 10 秒

export async function fetchWithTimeout<T>(url: string, options: Omit<FetchWithTimeoutOptions, 'url'>): Promise<FetchResponse<T>> {
    const { timeout = DEFAULT_TIMEOUT, ...restOptions } = options;

    const controller = new AbortController();
    const signal = controller.signal;

    const timeoutId = setTimeout(() => {
        controller.abort();
    }, timeout);

    try {
        const response = await fetch.request<T>({
            url,
            ...restOptions,
            signal
        });

        clearTimeout(timeoutId);
        return response;
    } catch (error: any) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error(`Request timeout after ${timeout}ms`);
        }
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
}
