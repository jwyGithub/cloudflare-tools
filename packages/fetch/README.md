<div align="center">
  <h1>cloudflare-tools-fetch</h1>
  <p>一个基于原生 fetch API 的轻量级 HTTP 客户端，提供超时控制、自动重试、拦截器等功能。</p>
  <p>
    <a href="https://www.npmjs.com/package/cloudflare-tools-fetch">
      <img src="https://img.shields.io/npm/v/cloudflare-tools-fetch.svg" alt="npm version" />
    </a>
    <a href="https://www.npmjs.com/package/cloudflare-tools-fetch">
      <img src="https://img.shields.io/npm/dm/cloudflare-tools-fetch.svg" alt="npm downloads" />
    </a>
    <a href="https://github.com/yourusername/worker-fetch/blob/main/LICENSE">
      <img src="https://img.shields.io/npm/l/cloudflare-tools-fetch.svg" alt="license" />
    </a>
  </p>
</div>

## ✨ 特性

- 🚀 **轻量级** - 零依赖，体积小巧
- 🔄 **拦截器** - 灵活的请求/响应拦截器
- ⏱️ **超时控制** - 可配置的请求超时机制
- 🔁 **自动重试** - 智能的请求重试策略
- 🎯 **流式处理** - 支持流式数据传输
- 🎯 **TypeScript** - 完整的类型定义支持
- 💫 **Request 对象** - 原生 Request 对象支持
- �� **Workers 支持** - 完美适配 Cloudflare Workers

## 📦 安装

```bash
# npm
npm install cloudflare-tools-fetch

# yarn
yarn add cloudflare-tools-fetch

# pnpm
pnpm add cloudflare-tools-fetch
```

## 🚀 快速开始

### 基本使用

```typescript
import { FetchClient } from 'cloudflare-tools-fetch';

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
import { fetchWithTimeout } from 'cloudflare-tools-fetch';

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
import { fetchWithRetry } from 'cloudflare-tools-fetch';

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

### 📦 流式数据处理

```typescript
import { FetchClient } from 'cloudflare-tools-fetch';

const client = new FetchClient();
const response = await client.fetchStream('https://api.example.com/stream', {
    timeout: 10000
});

const reader = response.data.getReader();
const chunks: Uint8Array[] = [];

while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
}

const result = new TextDecoder().decode(Buffer.concat(chunks));
console.log('接收到数据:', result);
```

## 📚 API 文档

### FetchClient

主要的客户端类，提供完整的 HTTP 请求功能。

#### 方法

| 方法                             | 描述             |
| -------------------------------- | ---------------- |
| `request(input, config)`         | 发送通用请求     |
| `get(url, config)`               | 发送 GET 请求    |
| `post(url, data, config)`        | 发送 POST 请求   |
| `put(url, data, config)`         | 发送 PUT 请求    |
| `delete(url, config)`            | 发送 DELETE 请求 |
| `fetchStream(url, options)`      | 发送流式请求     |
| `fetchJson<T>(url, options)`     | 获取 JSON 响应   |
| `fetchText(url, options)`        | 获取文本响应     |
| `fetchBlob(url, options)`        | 获取二进制数据   |
| `fetchArrayBuffer(url, options)` | 获取 ArrayBuffer |
| `fetchFormData(url, options)`    | 获取表单数据     |

#### 示例

```typescript
const client = new FetchClient();

// JSON 数据
const jsonData = await client.fetchJson<UserData>('/api/user');

// 文本数据
const textData = await client.fetchText('/api/text');

// 二进制数据
const blobData = await client.fetchBlob('/api/file');

// ArrayBuffer
const arrayBuffer = await client.fetchArrayBuffer('/api/binary');

// 表单数据
const formData = await client.fetchFormData('/api/form');

// 流式数据
const stream = await client.fetchStream('/api/stream');
```

每个方法都支持完整的请求配置选项，包括超时控制、重试机制等：

```typescript
const data = await client.fetchJson('/api/data', {
    timeout: 5000,
    retries: 3,
    headers: {
        'Content-Type': 'application/json'
    }
});
```

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
    url?: string; // 请求URL
    method?: HttpMethod; // 请求方法
    headers?: Record<string, string>; // 请求头
    body?: any; // 请求体
    params?: Record<string, any>; // URL参数
    timeout?: number; // 超时时间
    signal?: AbortSignal; // 中止信号
    retries?: number; // 重试次数
    retryDelay?: number; // 重试延迟
    retryOnStatusCodes?: number[]; // 重试状态码
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
