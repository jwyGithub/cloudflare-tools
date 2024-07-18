# @jiangweiye/cloudflare-fetch

### install

#### with pnpm

```sh
pnpm add @jiangweiye/cloudflare-fetch
```

#### with yarn

```sh
yarn add @jiangweiye/cloudflare-fetch
```

#### with npm

```sh
npm install @jiangweiye/cloudflare-fetch
```

## type

```typescript
import { AxiosErrorInterceptor, AxiosInterceptor, AxiosRequestConfig, AxiosResponse } from './types';

export declare class FetchClient {
    private requestInterceptors;
    private responseInterceptors;
    private errorInterceptors;
    request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    get<T = any>(url: string, config?: Omit<AxiosRequestConfig, 'url' | 'method'>): Promise<AxiosResponse<T>>;
    post<T = any>(url: string, data?: any, config?: Omit<AxiosRequestConfig, 'url' | 'method' | 'body'>): Promise<AxiosResponse<T>>;
    put<T = any>(url: string, data?: any, config?: Omit<AxiosRequestConfig, 'url' | 'method' | 'body'>): Promise<AxiosResponse<T>>;
    delete<T = any>(url: string, config?: Omit<AxiosRequestConfig, 'url' | 'method'>): Promise<AxiosResponse<T>>;
    useRequestInterceptor(interceptor: AxiosInterceptor<AxiosRequestConfig>): void;
    useResponseInterceptor(interceptor: AxiosInterceptor<AxiosResponse<any>>): void;
    useErrorInterceptor(interceptor: AxiosErrorInterceptor): void;
    private parseHeaders;
}
export declare const fetchClient: FetchClient;
```
