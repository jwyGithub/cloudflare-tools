import { fetchClient } from '../../../fetch/index';

fetchClient.useRequestInterceptor(config => {
    // console.log('Request Interceptor:', config);
    config.headers = {
        ...config.headers,
        Authorization: 'Bearer token'
    };
    return config;
});

fetchClient.useResponseInterceptor(response => {
    // console.log('Response Interceptor:', response);
    return response;
});

fetchClient.useErrorInterceptor(error => {
    // console.error('Error Interceptor:', error);
    throw error;
});

export default {
    async fetch(request, env, ctx): Promise<Response> {
        try {
            const response = await fetchClient.get<{ userId: number; id: number }>('https://jsonplaceholder.typicode.com/posts/1', {
                params: { userId: 1 }
            });
            return new Response(JSON.stringify(response.data));
        } catch (error: any) {
            return new Response(error);
        }
    }
} satisfies ExportedHandler<Env>;
