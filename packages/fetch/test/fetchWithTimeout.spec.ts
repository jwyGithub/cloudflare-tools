import { describe, expect, it, vi } from 'vitest';
import { fetchWithTimeout } from '../src/fetchWithTimeout';
import { BASE_URL } from './setup';

describe('fetchWithTimeout', () => {
    describe('基本功能', () => {
        it('应该成功发送请求', async () => {
            const result = JSON.stringify({ message: 'Hello World' });
            const response = await fetchWithTimeout(`${BASE_URL}/json?result=${result}`);
            const responseData = await response.data.json();
            expect(responseData).toEqual({ message: 'Hello World' });
            expect(response.status).toBe(200);
        });

        it('应该支持 Request 对象', async () => {
            const request = new Request(`${BASE_URL}/json`, {
                method: 'GET',
                headers: { Accept: 'application/json' }
            });
            const response = await fetchWithTimeout(request);
            expect(response.status).toBe(200);
        });
    });

    describe('超时功能', () => {
        it('默认不开启超时', async () => {
            const response = await fetchWithTimeout(`${BASE_URL}/json`);
            expect(response.status).toBe(200);
        });

        it('应该在超时时抛出错误', async () => {
            const onTimeout = vi.fn();
            await expect(
                fetchWithTimeout(`${BASE_URL}/timeout`, {
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
            const response = await fetchWithTimeout(`${BASE_URL}/json`, {
                timeout: 2000
            });
            expect(response.status).toBe(200);
        });
    });

    describe('错误处理', () => {
        it('应该处理服务器错误', async () => {
            const response = await fetchWithTimeout(`${BASE_URL}/error`);
            expect(response.ok).toBe(false);
            expect(response.status).toBe(500);
        });

        it('应该处理 404 错误', async () => {
            const response = await fetchWithTimeout(`${BASE_URL}/not-exist`);
            expect(response.ok).toBe(false);
            expect(response.status).toBe(404);
        });
    });
});
