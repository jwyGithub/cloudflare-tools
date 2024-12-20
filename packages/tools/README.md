<div align="center">
  <h1>cloudflare-tools</h1>
  <p>专为 Cloudflare Workers 环境优化的工具集合，提供 HTTP 客户端和编码工具。</p>
  <p>
    <a href="https://www.npmjs.com/package/cloudflare-tools">
      <img src="https://img.shields.io/npm/v/cloudflare-tools.svg" alt="npm version" />
    </a>
    <a href="https://www.npmjs.com/package/cloudflare-tools">
      <img src="https://img.shields.io/npm/dm/cloudflare-tools.svg" alt="npm downloads" />
    </a>
    <a href="https://github.com/cloudflare-tools/cloudflare-tools/blob/main/LICENSE">
      <img src="https://img.shields.io/npm/l/cloudflare-tools.svg" alt="license" />
    </a>
  </p>
</div>

## ✨ 功能特性

此包集成了以下两个核心模块的所有功能：

### 🌐 HTTP 客户端

```typescript
import { FetchClient, fetchWithTimeout, fetchWithRetry } from 'cloudflare-tools';

// 创建客户端实例
const client = new FetchClient();

// 发送请求
const response = await client.get('https://api.example.com/data');

// 使用超时控制
const data = await fetchWithTimeout('https://api.example.com', { timeout: 5000 });

// 使用自动重试
const result = await fetchWithRetry('https://api.example.com', { retries: 3 });
```

### 🛠️ 编码工具

```typescript
import { base64Encode, base64Decode, hexEncode, hexDecode, isValidIPv4, isValidIPv6 } from 'cloudflare-tools';

// Base64 编码/解码
const encoded = base64Encode('Hello World');
const decoded = base64Decode(encoded);

// Hex 编码/解码
const hexStr = hexEncode('Hello');
const originalStr = hexDecode(hexStr);

// IP 地址验证
console.log(isValidIPv4('192.168.1.1')); // true
console.log(isValidIPv6('2001:0db8:85a3:0000:0000:8a2e:0370:7334')); // true
```

## 📦 安装

```bash
npm install cloudflare-tools
# 或
yarn add cloudflare-tools
# 或
pnpm add cloudflare-tools
```

## 📚 API 文档

### HTTP 客户端 API

- `FetchClient` - HTTP 客户端类
    - `get(url, config?)` - GET 请求
    - `post(url, data?, config?)` - POST 请求
    - `put(url, data?, config?)` - PUT 请求
    - `delete(url, config?)` - DELETE 请求
- `fetchWithTimeout(url, options?)` - 带超时的请求
- `fetchWithRetry(url, options?)` - 带重试的请求

### 编码工具 API

- `base64Encode(str)` - Base64 编码
- `base64Decode(str)` - Base64 解码
- `hexEncode(str)` - Hex 编码
- `hexDecode(str)` - Hex 解码
- `isValidIPv4(ip)` - IPv4 地址验证
- `isValidIPv6(ip)` - IPv6 地址验证

## 📄 许可证

[Apache-2.0](./LICENSE)

## 🤝 贡献

欢迎提交 issue 和 PR！

---

<div align="center">
  <sub>Built with ❤️ by yuki</sub>
</div>
