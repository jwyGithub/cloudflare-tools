import type { AxiosErrorInterceptor, AxiosInterceptor, AxiosRequestConfig, AxiosResponse } from './types';

export class FetchClient {
    private requestInterceptors: AxiosInterceptor<AxiosRequestConfig>[] = [];
    private responseInterceptors: AxiosInterceptor<AxiosResponse<any>>[] = [];
    private errorInterceptors: AxiosErrorInterceptor[] = [];

    async request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
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

            let responseData: AxiosResponse<T> = {
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

    get<T = any>(url: string, config?: Omit<AxiosRequestConfig, 'url' | 'method'>): Promise<AxiosResponse<T>> {
        return this.request<T>({ ...config, url, method: 'GET' });
    }

    post<T = any>(url: string, data?: any, config?: Omit<AxiosRequestConfig, 'url' | 'method' | 'body'>): Promise<AxiosResponse<T>> {
        return this.request<T>({ ...config, url, method: 'POST', body: data });
    }

    put<T = any>(url: string, data?: any, config?: Omit<AxiosRequestConfig, 'url' | 'method' | 'body'>): Promise<AxiosResponse<T>> {
        return this.request<T>({ ...config, url, method: 'PUT', body: data });
    }

    delete<T = any>(url: string, config?: Omit<AxiosRequestConfig, 'url' | 'method'>): Promise<AxiosResponse<T>> {
        return this.request<T>({ ...config, url, method: 'DELETE' });
    }

    useRequestInterceptor(interceptor: AxiosInterceptor<AxiosRequestConfig>) {
        this.requestInterceptors.push(interceptor);
    }

    useResponseInterceptor(interceptor: AxiosInterceptor<AxiosResponse<any>>) {
        this.responseInterceptors.push(interceptor);
    }

    useErrorInterceptor(interceptor: AxiosErrorInterceptor) {
        this.errorInterceptors.push(interceptor);
    }

    private parseHeaders(headers: Headers): Record<string, string> {
        const parsedHeaders: Record<string, string> = {};
        headers.forEach((value, key) => {
            parsedHeaders[key] = value;
        });
        return parsedHeaders;
    }
}

export const fetchClient = new FetchClient();
