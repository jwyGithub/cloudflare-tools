# @jiangweiye/cloudflare-api

### install

#### with pnpm

```sh
pnpm add @jiangweiye/cloudflare-api
```

#### with yarn

```sh
yarn add @jiangweiye/cloudflare-api
```

#### with npm

```sh
npm install @jiangweiye/cloudflare-api
```

## type

```typescript
export declare const BASE_URL = 'https://api.cloudflare.com/client/v4';
export declare class CloudflareAPI {
    private static match_reg;
    protected static format(url: string, values: IApiContent): string;
}

```
