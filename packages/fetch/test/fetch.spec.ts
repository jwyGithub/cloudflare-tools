import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FetchClient } from '../src/fetch';

// 创建一个辅助函数来生成 mock Response
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

describe('fetchClient', () => {
    let client: FetchClient;
    let originalFetch: typeof fetch;

    beforeEach(() => {
        client = new FetchClient();
        originalFetch = globalThis.fetch;
    });

    afterEach(() => {
        globalThis.fetch = originalFetch;
        vi.clearAllMocks();
    });

    describe('基本请求功能', () => {
        it('应该成功发送 GET 请求', async () => {
            const response = await client.get('https://jsonplaceholder.typicode.com/posts/1');
            expect(response.data).toHaveProperty('id', 1);
            expect(response.status).toBe(200);
        });

        it('应该成功发送带参数的 POST 请求', async () => {
            const requestBody = {
                title: 'foo',
                body: 'bar',
                userId: 1
            };
            const response = await client.post('https://jsonplaceholder.typicode.com/posts', requestBody);
            expect(response.status).toBe(201);
            expect(response.data).toHaveProperty('id');
        });
    });

    describe('拦截器功能', () => {
        it('应该正确执行请求拦截器', async () => {
            const mockResponse = { data: 'test' };
            globalThis.fetch = vi.fn().mockResolvedValue(createMockResponse({ data: mockResponse }));

            const interceptor = vi.fn(config => ({
                ...config,
                headers: { 'X-Test': 'test' },
                retries: 0
            }));

            client.useRequestInterceptor(interceptor);
            await client.get('https://api.example.com/data');

            expect(interceptor).toHaveBeenCalled();
        });

        it('应该正确执行响应拦截器', async () => {
            const mockResponse = { data: 'test' };
            globalThis.fetch = vi.fn().mockResolvedValue({
                ok: true,
                status: 200,
                statusText: 'OK',
                headers: new Headers(),
                json: () => Promise.resolve(mockResponse)
            });

            const interceptor = vi.fn(response => ({
                ...response,
                data: { ...response.data, intercepted: true }
            }));

            client.useResponseInterceptor(interceptor);

            const response = await client.get('https://api.example.com/data');

            expect(interceptor).toHaveBeenCalled();
            expect(response.data).toHaveProperty('intercepted', true);
        });
    });

    describe('重试功能', () => {
        it('应该在请求失败时进行重试', async () => {
            // 使用不存在的 ID 触发 404
            const response = await client.get('https://jsonplaceholder.typicode.com/posts/999', {
                retries: 1,
                retryDelay: 100,
                retryOnStatusCodes: [404]
            });
            expect(response.status).toBe(404);
        });
    });

    describe('超时功能', () => {
        it('应该在超时时抛出错误', async () => {
            // 使用一个较慢的 API
            await expect(
                client.get('https://httpbin.org/delay/2', {
                    timeout: 1000
                })
            ).rejects.toThrow('请求超时');
        });
    });

    describe('错误处理', () => {
        it('应该处理网络错误', async () => {
            globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

            await expect(client.get('https://api.example.com/data')).rejects.toThrow('Network error');
        });

        it('应该处理 HTTP 错误状态码', async () => {
            globalThis.fetch = vi.fn().mockResolvedValue({
                ok: false,
                status: 404,
                statusText: 'Not Found',
                headers: new Headers(),
                json: () => Promise.resolve({ error: 'Not found' })
            });

            const response = await client.get('https://api.example.com/data');
            expect(response.ok).toBe(false);
            expect(response.status).toBe(404);
        });
    });
});
