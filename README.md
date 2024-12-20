# Cloudflare Tools

一个用于 Cloudflare Workers 的工具集合，提供了多个实用的功能模块。

## 📦 包含的模块

### 🚀 @jiangweiye/worker-fetch

一个功能强大的 HTTP 客户端，专为 Cloudflare Workers 环境优化。

**主要特性：**

- 超时控制
- 自动重试
- 请求/响应拦截器
- 流式数据处理
- 完整的 TypeScript 支持

[详细文档](./packages/fetch/README.md)

### 🛠️ @jiangweiye/cloudflare-service

用于处理 Cloudflare Workers 响应的工具类。

**主要功能：**

- 标准化的响应格式
- 常用状态码处理
- 错误处理封装

[详细文档](./packages/service/README.md)

### 🔧 @jiangweiye/cloudflare-shared

通用工具函数集合。

**核心功能：**

- Base64 编解码
- 流数据处理
- 文本转换工具

[详细文档](./packages/shared/README.md)

## 📥 安装

每个包都可以独立安装使用：

```bash
# Fetch 客户端
npm install @jiangweiye/worker-fetch

# Service 工具
npm install @jiangweiye/cloudflare-service

# 通用工具
npm install @jiangweiye/cloudflare-shared
```

## 🔗 快速链接

- [Fetch 客户端文档](./packages/fetch/README.md)
- [Service 工具文档](./packages/service/README.md)
- [通用工具文档](./packages/shared/README.md)

## 📄 许可证

Apache License 2.0

## 🤝 贡献

欢迎提交 issue 和 PR！

---

<div align="center">
  <sub>Built with ❤️ for Cloudflare Workers</sub>
</div>
