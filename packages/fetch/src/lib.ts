import type { FetchErrorInterceptor, FetchInterceptor, FetchRequestConfig, FetchResponse } from './types';

export class FetchClient {
    private requestInterceptors: FetchInterceptor<FetchRequestConfig>[] = [];
    private responseInterceptors: FetchInterceptor<FetchResponse<any>>[] = [];
    private errorInterceptors: FetchErrorInterceptor[] = [];

    async request<T = any>(config: FetchRequestConfig): Promise<FetchResponse<T>> {
        try {
            // 执行请求拦截器
            for (const interceptor of this.requestInterceptors) {
                config = await interceptor(config);
            }

            let { url, method = 'GET', headers, params, body, responseType = 'json' } = config;

            // 处理查询参数
            if (params) {
                const queryString = new URLSearchParams(params).toString();
                url += (url.includes('?') ? '&' : '?') + queryString;
            }

            const response = await fetch(url, {
                method,
                headers,
                body: body ? JSON.stringify(body) : undefined
            });

            let data: any;
            switch (responseType) {
                case 'text':
                    data = await response.text();
                    break;
                case 'blob':
                    data = await response.blob();
                    break;
                case 'json':
                default:
                    data = await response.json();
                    break;
            }

            let responseData: FetchResponse<T> = {
                data,
                status: response.status,
                statusText: response.statusText,
                headers: this.parseHeaders(response.headers),
                config,
                request: response
            };

            // 执行响应拦截器
            for (const interceptor of this.responseInterceptors) {
                responseData = await interceptor(responseData);
            }

            return responseData;
        } catch (error) {
            let _error = error;
            // 执行错误拦截器
            for (const interceptor of this.errorInterceptors) {
                _error = await interceptor(error);
            }
            throw _error;
        }
    }

    get<T = any>(url: string, config?: Omit<FetchRequestConfig, 'url' | 'method'>): Promise<FetchResponse<T>> {
        return this.request<T>({ ...config, url, method: 'GET' });
    }

    post<T = any>(url: string, data?: any, config?: Omit<FetchRequestConfig, 'url' | 'method' | 'body'>): Promise<FetchResponse<T>> {
        return this.request<T>({ ...config, url, method: 'POST', body: data });
    }

    put<T = any>(url: string, data?: any, config?: Omit<FetchRequestConfig, 'url' | 'method' | 'body'>): Promise<FetchResponse<T>> {
        return this.request<T>({ ...config, url, method: 'PUT', body: data });
    }

    delete<T = any>(url: string, config?: Omit<FetchRequestConfig, 'url' | 'method'>): Promise<FetchResponse<T>> {
        return this.request<T>({ ...config, url, method: 'DELETE' });
    }

    useRequestInterceptor(interceptor: FetchInterceptor<FetchRequestConfig>) {
        this.requestInterceptors.push(interceptor);
    }

    useResponseInterceptor(interceptor: FetchInterceptor<FetchResponse<any>>) {
        this.responseInterceptors.push(interceptor);
    }

    useErrorInterceptor(interceptor: FetchErrorInterceptor) {
        this.errorInterceptors.push(interceptor);
    }

    private parseHeaders(headers: Headers): Headers {
        const parsedHeaders = new Headers();
        headers.forEach((value, key) => {
            parsedHeaders.set(key, value);
        });
        return parsedHeaders;
    }
}

export const fetchClient = new FetchClient();
