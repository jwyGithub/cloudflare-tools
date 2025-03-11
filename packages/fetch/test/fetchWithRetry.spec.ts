import { describe, expect, it, vi } from 'vitest';
import { fetchWithRetry } from '../src/fetchWithRetry';
import { BASE_URL } from './setup';

describe('fetchWithRetry', () => {
    describe('基本功能', () => {
        it('应该成功发送请求', async () => {
            const result = JSON.stringify({ message: 'Hello World' });
            const response = await fetchWithRetry(`${BASE_URL}/json?result=${result}`);
            const responseData = await response.data.json();
            expect(responseData).toEqual({ message: 'Hello World' });
            expect(response.status).toBe(200);
        });

        it('应该支持 Request 对象', async () => {
            const request = new Request(`${BASE_URL}/json`, {
                method: 'GET',
                headers: { Accept: 'application/json' }
            });
            const response = await fetchWithRetry(request);
            expect(response.status).toBe(200);
        });
    });

    describe('重试功能', () => {
        it('默认不进行重试', async () => {
            const response = await fetchWithRetry(`${BASE_URL}/error`);
            expect(response.status).toBe(500);
        });

        it('应该在指定状态码时进行重试', async () => {
            const onError = vi.fn();
            const response = await fetchWithRetry(`${BASE_URL}/error`, {
                retries: 2,
                retryDelay: 100,
                retryOn: [500],
                onError
            });

            expect(response.status).toBe(500);
            expect(onError).toHaveBeenCalledTimes(2);
        });

        it('应该在网络错误时进行重试', async () => {
            const onError = vi.fn();
            const invalidUrl = 'http://invalid-url-that-does-not-exist.example';
            await expect(
                fetchWithRetry(invalidUrl, {
                    retries: 2,
                    retryDelay: 100,
                    onError
                })
            ).rejects.toThrow();
            expect(onError).toHaveBeenCalledTimes(3);
        });

        it('应该在请求错误时进行重试', async () => {
            const onError = vi.fn();
            const invalidUrl = 'https://42d55df4-4c8e-43d8-a81e-e5c117e29c78.nicoo.us.kg/vps-trojan?sub=https://trojan.cmliussss.net/auto';
            await expect(
                fetchWithRetry(invalidUrl, {
                    retries: 2,
                    retryDelay: 100,
                    onError
                })
            ).rejects.toThrow();
            expect(onError).toHaveBeenCalledTimes(3);
        });
    });

    describe('错误回调', () => {
        it('应该在失败时调用错误回调', async () => {
            const onError = vi.fn();
            const response = await fetchWithRetry(`${BASE_URL}/error`, {
                retries: 1,
                retryDelay: 100,
                retryOn: response => response.status === 500,
                onError
            });

            expect(response.status).toBe(500);
            expect(onError).toHaveBeenCalledWith(expect.any(Error), expect.any(Number));
        });

        it('应该支持异步错误回调', async () => {
            const onError = vi.fn().mockImplementation(() => Promise.resolve());
            const response = await fetchWithRetry(`${BASE_URL}/error`, {
                retries: 1,
                retryDelay: 100,
                retryOn: [500],
                onError
            });

            expect(response.status).toBe(500);
            expect(onError).toHaveBeenCalled();
        });
    });
});
