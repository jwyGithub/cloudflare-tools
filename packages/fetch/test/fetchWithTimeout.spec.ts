import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchWithTimeout } from '../src/fetchWithTimeout';

describe('fetchWithTimeout', () => {
    let originalFetch: typeof fetch;

    beforeEach(() => {
        originalFetch = globalThis.fetch;
    });

    afterEach(() => {
        globalThis.fetch = originalFetch;
        vi.clearAllMocks();
    });

    function createMockResponse(options: { ok?: boolean; status?: number; statusText?: string; data?: any }) {
        const { ok = true, status = 200, statusText = 'OK', data = {} } = options;
        return {
            ok,
            status,
            statusText,
            headers: new Headers(),
            json: () => Promise.resolve(data)
        } as Response;
    }

    describe('基本功能', () => {
        it('应该成功发送请求', async () => {
            const mockData = { id: 1, title: 'test' };
            globalThis.fetch = vi.fn().mockResolvedValue(createMockResponse({ data: mockData }));

            const response = await fetchWithTimeout('https://api.example.com/todos/1');
            expect(response.status).toBe(200);
            expect(response.data).toEqual(mockData);
        });

        it('应该支持 Request 对象', async () => {
            const mockData = { id: 1 };
            globalThis.fetch = vi.fn().mockResolvedValue(createMockResponse({ data: mockData }));

            const request = new Request('https://api.example.com/todos/1', {
                method: 'GET',
                headers: { Accept: 'application/json' }
            });
            const response = await fetchWithTimeout(request);
            expect(response.status).toBe(200);
            expect(response.data).toEqual(mockData);
        });
    });

    describe('超时功能', () => {
        it('默认不开启超时', async () => {
            const response = await fetchWithTimeout('https://jsonplaceholder.typicode.com/todos/1');
            expect(response.status).toBe(200);
        });

        it('应该在超时时抛出错误', async () => {
            const onTimeout = vi.fn();
            await expect(
                fetchWithTimeout('https://httpbin.org/delay/3', {
                    timeout: 1000,
                    onTimeout
                })
            ).rejects.toMatchObject({
                name: 'TimeoutError',
                message: 'The request timed out'
            });
            expect(onTimeout).toHaveBeenCalledWith(expect.any(Error));
        });

        it('应该在超时前完成请求', async () => {
            const response = await fetchWithTimeout('https://httpbin.org/delay/1', {
                timeout: 2000
            });
            expect(response.status).toBe(200);
        });

        it('应该支持自定义 signal', async () => {
            const controller = new AbortController();
            const promise = fetchWithTimeout('https://httpbin.org/delay/2', {
                signal: controller.signal
            });

            controller.abort();
            await expect(promise).rejects.toThrow(DOMException);
            await expect(promise).rejects.toHaveProperty('name', 'AbortError');
        });
    });

    describe('错误处理', () => {
        it('应该处理网络错误', async () => {
            globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
            await expect(fetchWithTimeout('https://api.example.com/todos/1')).rejects.toThrow();
        });

        it('应该处理 HTTP 错误状态码', async () => {
            globalThis.fetch = vi.fn().mockResolvedValue(
                createMockResponse({
                    ok: false,
                    status: 404,
                    statusText: 'Not Found'
                })
            );
            const response = await fetchWithTimeout('https://api.example.com/todos/999');
            expect(response.ok).toBe(false);
            expect(response.status).toBe(404);
        });
    });

    describe('配置选项', () => {
        it('应该使用默认配置', async () => {
            globalThis.fetch = vi.fn().mockResolvedValue(createMockResponse({}));
            const response = await fetchWithTimeout('https://api.example.com/todos/1');
            expect(response.ok).toBe(true);
        });

        it('应该合并自定义配置', async () => {
            globalThis.fetch = vi.fn().mockResolvedValue(createMockResponse({}));
            const response = await fetchWithTimeout('https://api.example.com/todos/1', {
                headers: { Accept: 'application/json' }
            });
            expect(response.ok).toBe(true);
        });
    });
});
