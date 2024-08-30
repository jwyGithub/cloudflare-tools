# cloudflare-tools

cloudflare tool code.

## Packages

-   [@jiangweiye/cloudflare-service](#cloudflare-service)
-   [@jiangweiye/cloudflare-fetch](#cloudflare-fetch)
-   [@jiangweiye/cloudflare-shared](#cloudflare-shared)

### cloudflare-service

[使用示例](https://github.com/jwyGithub/cloudflare-shared/tree/main/packages/service)

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

### cloudflare-fetch

[使用示例](https://github.com/jwyGithub/cloudflare-shared/tree/main/packages/fetch)

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

### cloudflare-shared

[使用示例](https://github.com/jwyGithub/cloudflare-shared/tree/main/packages/shared)

```typescript
export declare class TextCode {
    /**
     * @description Base64 decode a string
     * @param {string} s Encoded string
     * @returns {string} - Decoded string
     */
    static base64Encode(s: string): string;
    /**
     * @description Base64 decode a string
     * @param {string} s Encoded string
     * @returns {string} - Decoded string
     */
    static base64Decode(s: string): string;
    /**
     * @description Convert a stream to text
     * @param {ReadableStream} stream - ReadableStream
     * @returns {Promise<string>} - Promise<string>
     */
    static streamToText(stream: ReadableStream): Promise<string>;
    /**
     * @description Convert a blob to text
     * @param {Blob} blob - Blob
     * @returns {Promise<string>} - Promise<string>
     */
    static blobToText(blob: Blob): Promise<string>;
    /**
     * @description Convert an array buffer to text
     * @param {ArrayBuffer} buffer - ArrayBuffer
     * @returns {string} - Text
     */
    static arrayBufferToText(buffer: ArrayBuffer): string;
}
```
