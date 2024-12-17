import { describe, expect, it, vi } from 'vitest';
import { fetchWithRetry } from '../src/fetchWithRetry';

describe('fetchWithRetry', () => {
    describe('基本功能', () => {
        it('应该成功发送请求', async () => {
            const response = await fetchWithRetry('https://jsonplaceholder.typicode.com/posts/1');
            expect(response.data).toHaveProperty('id', 1);
            expect(response.status).toBe(200);
        });

        it('应该支持 Request 对象', async () => {
            const request = new Request('https://jsonplaceholder.typicode.com/posts/1', {
                method: 'GET',
                headers: { Accept: 'application/json' }
            });
            const response = await fetchWithRetry(request);
            expect(response.status).toBe(200);
        });
    });

    describe('重试功能', () => {
        it('默认不进行重试', async () => {
            const response = await fetchWithRetry('https://jsonplaceholder.typicode.com/posts/999');
            expect(response.status).toBe(404);
        });

        it('应该在指定状态码时进行重试', async () => {
            const onError = vi.fn();
            const response = await fetchWithRetry('https://jsonplaceholder.typicode.com/posts/999', {
                retries: 2,
                retryDelay: 100,
                retryOnStatusCodes: [404],
                onError
            });

            expect(response.status).toBe(404);
            expect(onError).toHaveBeenCalledTimes(2);
        });

        it('应该在网络错误时进行重试', async () => {
            const onError = vi.fn();
            await expect(
                fetchWithRetry('https://invalid-url.example.com', {
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
            const response = await fetchWithRetry('https://jsonplaceholder.typicode.com/posts/999', {
                retries: 1,
                retryDelay: 100,
                retryOnStatusCodes: [404],
                onError
            });

            expect(response.status).toBe(404);
            expect(onError).toHaveBeenCalledWith(expect.any(Error), expect.any(Number));
        });

        it('应该支持异步错误回调', async () => {
            const onError = vi.fn().mockImplementation(() => Promise.resolve());
            const response = await fetchWithRetry('https://jsonplaceholder.typicode.com/posts/999', {
                retries: 1,
                retryDelay: 100,
                retryOnStatusCodes: [404],
                onError
            });

            expect(response.status).toBe(404);
            expect(onError).toHaveBeenCalled();
        });
    });

    describe('配置选项', () => {
        it('应该使用默认配置', async () => {
            const response = await fetchWithRetry('https://jsonplaceholder.typicode.com/posts/1');
            expect(response.ok).toBe(true);
        });

        it('应该合并自定义配置', async () => {
            const response = await fetchWithRetry('https://jsonplaceholder.typicode.com/posts/1', {
                headers: { Accept: 'application/json' },
                retries: 2,
                retryDelay: 100
            });
            expect(response.ok).toBe(true);
        });
    });
});
