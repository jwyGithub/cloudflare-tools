export interface AxiosRequestConfig {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Record<string, string>;
    params?: Record<string, any>;
    body?: any;
    responseType?: 'json' | 'text' | 'blob';
}

export interface AxiosResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: Record<string, string>;
    config: AxiosRequestConfig;
    request: Response;
}

export type AxiosInterceptor<T> = (value: T) => T | Promise<T>;
export type AxiosErrorInterceptor = (error: any) => any;
