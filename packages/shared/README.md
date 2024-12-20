<div align="center">
  <h1>@jiangweiye/worker-shared</h1>
  <p>Cloudflare Worker 通用工具库，提供编码转换、IP 验证、消息通知等功能</p>
  <p>
    <a href="https://www.npmjs.com/package/@jiangweiye/worker-shared">
      <img src="https://img.shields.io/npm/v/@jiangweiye/worker-shared.svg" alt="npm version" />
    </a>
    <a href="https://www.npmjs.com/package/@jiangweiye/worker-shared">
      <img src="https://img.shields.io/npm/dm/@jiangweiye/worker-shared.svg" alt="npm downloads" />
    </a>
    <a href="https://github.com/yourusername/worker-shared/blob/main/LICENSE">
      <img src="https://img.shields.io/npm/l/@jiangweiye/worker-shared.svg" alt="license" />
    </a>
  </p>
</div>

## 📦 安装

```bash
# npm
npm install @jiangweiye/worker-shared

# yarn
yarn add @jiangweiye/worker-shared

# pnpm
pnpm add @jiangweiye/worker-shared
```

## 🚀 功能特性

### 🔍 编码转换

#### Base64 编码/解码

```typescript
import { base64Decode, base64Encode, tryBase64Decode, tryBase64Encode } from '@jiangweiye/worker-shared';

// 基本使用
const encoded = base64Encode('Hello World');
const decoded = base64Decode(encoded);

// 安全使用（带错误处理）
const safeEncoded = tryBase64Encode('Hello World');
const safeDecoded = tryBase64Decode(encoded, s => `解码失败: ${s}`);
```

#### 十六进制编码/解码

```typescript
import { hexDecode, hexEncode, tryHexDecode, tryHexEncode } from '@jiangweiye/worker-shared';

// 基本使用
const encoded = hexEncode('Hello');
const decoded = hexDecode(encoded);

// 安全使用
const safeEncoded = tryHexEncode('Hello');
const safeDecoded = tryHexDecode(encoded);
```

#### URL 编码/解码

```typescript
import { tryUrlDecode, tryUrlEncode } from '@jiangweiye/worker-shared';

// 安全的 URL 编码/解码
const encoded = tryUrlEncode('Hello World');
const decoded = tryUrlDecode(encoded);
```

### 🔍 IP 验证

```typescript
import { IpValidator, validateIp } from '@jiangweiye/worker-shared';

// 函数式用法
validateIp('192.168.1.1', ['192.168.*.*']); // true
validateIp(request, ['10.0.0.*']); // 支持 Request 对象

// 类式用法（适合频繁验证）
const validator = new IpValidator(['192.168.*.*']);
validator.validate('192.168.1.1'); // true
```

### 📨 Telegram 通知

```typescript
import { notifyTelegram } from '@jiangweiye/worker-shared';

// 发送单条消息
await notifyTelegram({
    token: 'YOUR_BOT_TOKEN',
    chatId: 'CHAT_ID',
    message: 'Hello from Worker!'
});

// 发送多条消息
await notifyTelegram({
    token: 'YOUR_BOT_TOKEN',
    chatId: 'CHAT_ID',
    message: ['Line 1', 'Line 2', 'Line 3']
});
```

## 📚 API 文档

### 编码转换

#### Base64

```typescript
function base64Encode(s: string): string;
function base64Decode(s: string): string;
function tryBase64Encode<C>(s: string, onCatch?: (s: string) => string | C): string | C;
function tryBase64Decode<C>(s: string, onCatch?: (s: string) => string | C): string | C;
```

#### Hex (十六进制)

```typescript
function hexEncode(s: string): string;
function hexDecode(s: string): string;
function tryHexEncode(s: string): string;
function tryHexDecode(s: string): string;
```

#### URL

```typescript
function tryUrlEncode<C>(s: string, onCatch?: (s: string) => string | C): string | C;
function tryUrlDecode<C>(s: string, onCatch?: (s: string) => string | C): string | C;
```

### IP 验证

```typescript
function validateIp(input: string | Request, match: string[] | null = ['*']): boolean;

class IpValidator {
    constructor(rules: string[] = ['*']);
    validate(input: string | Request): boolean;
    updateRules(rules: string[]): void;
}
```

### Telegram 通知

```typescript
interface SendMessageString {
    token?: string;
    chatId?: string;
    message?: string;
}

interface SendMessageArray {
    token?: string;
    chatId?: string;
    message?: string[];
}

function notifyTelegram(options: SendMessageString | SendMessageArray): Promise<Response>;
```

## 🌐 浏览器兼容性

- 支持所有现代浏览器
- 支持 Cloudflare Workers 环境
- 需要 ES2015+ 支持

## 📄 许可证

[MIT](./LICENSE)

## 🤝 贡献

欢迎提交 issue 和 PR！

---

<div align="center">
  <sub>Built with ❤️ by jiangweiye</sub>
</div>
