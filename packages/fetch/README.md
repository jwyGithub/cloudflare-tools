# @jiangweiye/cloudflare-service

### install

#### with pnpm

```sh
pnpm add @jiangweiye/cloudflare-service
```

#### with yarn

```sh
yarn add @jiangweiye/cloudflare-service
```

#### with npm

```sh
npm install @jiangweiye/cloudflare-service
```

## type

```typescript
export declare class Service {
    static success(data: any, message?: string): Response;
    static clientError(reason?: string): Response;
    static notFound(reason?: string): Response;
    static unauthorized(reason?: string): Response;
    static gatewayTimeout(reason?: string): Response;
    static serverError(reason?: string): Response;
    static unknownError(reason?: string): Response;
}
```
