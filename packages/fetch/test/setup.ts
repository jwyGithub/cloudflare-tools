import type { AddressInfo } from 'node:net';
import { createServer, type Server } from 'node:http';
import { Readable } from 'node:stream';
import { TextEncoder } from 'node:util';
import { afterAll, afterEach, beforeAll } from 'vitest';

let server: Server | null = null;
// eslint-disable-next-line import/no-mutable-exports
let BASE_URL: string;

// 获取随机可用端口
async function getAvailablePort(start = 3000, end = 4000): Promise<number> {
    const net = await import('node:net');

    return new Promise((resolve, reject) => {
        const server = net.createServer();
        const tryPort = Math.floor(Math.random() * (end - start) + start);

        server.once('error', () => {
            // 如果端口被占用，递归尝试另一个端口
            getAvailablePort(start, end).then(resolve, reject);
        });

        server.once('listening', () => {
            const { port } = server.address() as AddressInfo;
            server.close(() => resolve(port));
        });

        server.listen(tryPort);
    });
}

// 创建模拟的流数据
function createStreamResponse(chunks: string[] = ['Hello', ' ', 'World']) {
    const stream = new Readable({
        read() {
            const chunk = chunks.shift();
            if (chunk) {
                this.push(new TextEncoder().encode(chunk));
            } else {
                this.push(null);
            }
        }
    });
    return stream;
}

// 关闭服务器的辅助函数
async function closeServer(): Promise<void> {
    return new Promise(resolve => {
        if (server) {
            server.close(() => {
                server = null;
                resolve();
            });
        } else {
            resolve();
        }
    });
}

beforeAll(async () => {
    // 确保之前的服务器已关闭
    await closeServer();

    // 获取随机可用端口
    const port = await getAvailablePort();
    BASE_URL = `http://localhost:${port}`;

    // 创建新服务器
    server = createServer((req, res) => {
        const url = new URL(req.url!, BASE_URL);
        const params = url.searchParams;

        // 路由处理
        switch (url.pathname) {
            case '/json':
                res.setHeader('Content-Type', 'application/json');
                res.end(params.get('result'));
                break;

            case '/stream': {
                res.setHeader('Content-Type', 'text/plain');
                res.setHeader('Transfer-Encoding', 'chunked');

                const chunks = ['Hello', ' ', 'World'];
                let index = 0;

                const sendChunk = () => {
                    if (index < chunks.length) {
                        res.write(chunks[index++]);
                        setTimeout(sendChunk, 100);
                    } else {
                        res.end();
                    }
                };

                sendChunk();
                break;
            }

            case '/large-stream': {
                res.setHeader('Content-Type', 'text/plain');
                res.setHeader('Transfer-Encoding', 'chunked');
                const largeStream = createStreamResponse(Array.from({ length: 1000 }).fill('X') as string[]);
                largeStream.pipe(res);
                break;
            }

            case '/error':
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
                break;

            case '/timeout': {
                // 不发送任何响应，让请求超时
                const timer = setTimeout(() => {
                    res.end('Delayed Response');
                }, 5000); // 设置一个较长的延迟

                // 清理定时器
                res.on('close', () => {
                    clearTimeout(timer);
                });
                break;
            }

            case '/retry-test': {
                // 模拟需要重试的场景
                const retryCount = Number(url.searchParams.get('retry') || '0');
                if (retryCount < 2) {
                    res.statusCode = 500;
                    res.end('Retry needed');
                } else {
                    res.end('Success after retry');
                }
                break;
            }

            case '/custom-timeout': {
                // 可配置的超时时间
                const delay = Number(url.searchParams.get('delay') || '1000');
                setTimeout(() => {
                    res.end('Delayed response');
                }, delay);
                break;
            }

            default:
                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Not Found' }));
                break;
        }
    });

    // 使用 Promise 包装服务器启动
    await new Promise<void>((resolve, reject) => {
        server!.on('error', err => {
            console.error(`Server error:`, err);
            reject(err);
        });

        server!.listen(port, () => {
            // eslint-disable-next-line no-console
            console.log(`Test server listening on port ${port}`);
            resolve();
        });
    });
});

afterAll(async () => {
    await closeServer();
});

afterEach(() => {
    // 清理任何测试状态
});

// 导出测试服务器 URL
export { BASE_URL };
