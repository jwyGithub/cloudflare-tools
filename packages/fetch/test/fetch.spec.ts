import { describe, expect, it } from 'vitest';
import { FetchClient } from '../src/fetch';
import { BASE_URL } from './setup';

describe('fetchClient', () => {
    describe('流式处理', () => {
        it('应该正确获取流数据', async () => {
            const client = new FetchClient();
            const response = await client.fetchStream(`${BASE_URL}/stream`);

            expect(response.data).toBeInstanceOf(ReadableStream);
            expect(response.ok).toBe(true);

            // 读取并验证流数据
            const reader = response.data.getReader();
            const chunks: Uint8Array[] = [];

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                chunks.push(value);
            }

            // 合并并解码数据
            const concatenated = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
            let offset = 0;
            for (const chunk of chunks) {
                concatenated.set(chunk, offset);
                offset += chunk.length;
            }
            const result = new TextDecoder().decode(concatenated);

            expect(result).toBe('Hello World');
        });

        it('应该处理大文件流', async () => {
            const client = new FetchClient();
            const response = await client.fetchStream(`${BASE_URL}/large-stream`);

            const reader = response.data.getReader();
            let totalSize = 0;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                totalSize += value.length;
            }

            expect(totalSize).toBe(1000);
        });

        it('应该处理流错误', async () => {
            const client = new FetchClient();
            const response = await client.fetchStream(`${BASE_URL}/error`);
            expect(response.ok).toBe(false);
            expect(response.status).toBe(500);
        });
    });
});
