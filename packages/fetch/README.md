<div align="center">
  <h1>@jiangweiye/worker-fetch</h1>
  <p>一个基于原生 fetch API 的轻量级 HTTP 客户端，提供超时控制、自动重试、拦截器等功能。</p>
  <p>
    <a href="https://www.npmjs.com/package/@jiangweiye/worker-fetch">
      <img src="https://img.shields.io/npm/v/@jiangweiye/worker-fetch.svg" alt="npm version" />
    </a>
    <a href="https://www.npmjs.com/package/@jiangweiye/worker-fetch">
      <img src="https://img.shields.io/npm/dm/@jiangweiye/worker-fetch.svg" alt="npm downloads" />
    </a>
    <a href="https://github.com/yourusername/worker-fetch/blob/main/LICENSE">
      <img src="https://img.shields.io/npm/l/@jiangweiye/worker-fetch.svg" alt="license" />
    </a>
  </p>
</div>

## ✨ 特性

-   🚀 **轻量级** - 零依赖，体积小巧
-   🔄 **拦截器** - 灵活的请求/响应拦截器
-   ⏱️ **超时控制** - 可配置的请求超时机制
-   🔁 **自动重试** - 智能的请求重试策略
-   🎯 **TypeScript** - 完整的类型定义支持
-   💫 **Request 对象** - 原生 Request 对象支持
-   🌐 **Workers 支持** - 完美适配 Cloudflare Workers

## 📦 安装

```bash
# npm
npm install @jiangweiye/worker-fetch

# yarn
yarn add @jiangweiye/worker-fetch

# pnpm
pnpm add @jiangweiye/worker-fetch
```

## 🚀 快速开始

### 基本使用

```typescript
import { FetchClient } from '@jiangweiye/worker-fetch';

const client = new FetchClient();

// GET 请求
const response = await client.get('https://api.example.com/data');

// POST 请求
const response = await client.post('https://api.example.com/data', {
    name: 'test',
    value: 123
});
```

### 🔌 拦截器

```typescript
// 请求拦截器
client.useRequestInterceptor(config => {
    config.headers = {
        ...config.headers,
        Authorization: 'Bearer token'
    };
    return config;
});

// 响应拦截器
client.useResponseInterceptor(response => {
    if (!response.ok) {
        throw new Error(`请求失败: ${response.status}`);
    }
    return response;
});
```

### ⏱️ 超时控制

```typescript
// 使用 fetchWithTimeout
import { fetchWithTimeout } from '@jiangweiye/worker-fetch';

const response = await fetchWithTimeout('https://api.example.com/data', {
    timeout: 5000, // 5秒超时
    onTimeout: error => {
        console.log('请求超时:', error);
    }
});

// 或使用 FetchClient
const response = await client.request('https://api.example.com/data', {
    timeout: 5000
});
```

### 🔄 自动重试

```typescript
// 使用 fetchWithRetry
import { fetchWithRetry } from '@jiangweiye/worker-fetch';

const response = await fetchWithRetry('https://api.example.com/data', {
    retries: 3, // 最多重试3次
    retryDelay: 1000, // 重试间隔1秒
    retryOnStatusCodes: [500, 502, 503], // 指定状态码时重试
    onError: (error, attempt) => {
        console.log(`第 ${attempt} 次重试失败:`, error);
    }
});
```

### 💫 使用 Request 对象

```typescript
const request = new Request('https://api.example.com/data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: 'value' })
});

const response = await client.request(request, {
    timeout: 5000,
    retries: 3
});
```

## 📚 API 文档

### FetchClient

主要的客户端类，提供完整的 HTTP 请求功能。

#### 方法

| 方法 | 描述 |
|------|------|
| `request(input, config)` | 发送请求 |
| `get(url, config)` | 发送 GET 请求 |
| `post(url, data, config)` | 发送 POST 请求 |
| `put(url, data, config)` | 发送 PUT 请求 |
| `delete(url, config)` | 发送 DELETE 请求 |
| `useRequestInterceptor(interceptor)` | 添加请求拦截器 |
| `useResponseInterceptor(interceptor)` | 添加响应拦截器 |

### fetchWithTimeout

带超时控制的独立请求函数。支持：
- ⏱️ 可配置的超时时间
- 🔔 超时回调函数
- 🎯 自定义 AbortSignal

### fetchWithRetry

带重试机制的独立请求函数。支持：
- 🔄 可配置的重试次数
- ⏰ 重试延迟时间
- 🎯 指定重试状态码
- 📢 错误回调函数

## ⚙️ 配置选项

```typescript
interface FetchRequestConfig {
    url?: string;                        // 请求URL
    method?: HttpMethod;                 // 请求方法
    headers?: Record<string, string>;    // 请求头
    body?: any;                          // 请求体
    params?: Record<string, any>;        // URL参数
    timeout?: number;                    // 超时时间
    signal?: AbortSignal;               // 中止信号
    retries?: number;                    // 重试次数
    retryDelay?: number;                // 重试延迟
    retryOnStatusCodes?: number[];      // 重试状态码
}
```

## 📄 许可证

[MIT](./LICENSE)

## 🤝 贡献

欢迎提交 issue 和 PR！

---

<div align="center">
  <sub>Built with ❤️ by yuki</sub>
</div>
