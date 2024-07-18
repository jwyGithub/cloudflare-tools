// test/index.spec.ts
import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src/index';
import { fetchClient } from '../../../fetch/index';

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('fetch client', () => {
    it('responds with Hello World! (unit style)', async () => {
        const request = new IncomingRequest('get');
        // Create an empty context to pass to `worker.fetch()`.
        const ctx = createExecutionContext();
        const response = await worker.fetch(request, env, ctx);
        // Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
        await waitOnExecutionContext(ctx);

        const res = await response.json();
        expect(res).toMatchObject({
            userId: 1,
            id: 1
        });
    });

    it('send get request', async () => {
        const response = await fetchClient.get('https://jsonplaceholder.typicode.com/posts/1', {
            params: { userId: 1 }
        });

        expect(response.data).toMatchObject({
            userId: 1,
            id: 1
        });
    });

    it('send post request', async () => {
        const response = await fetchClient.post('https://jsonplaceholder.typicode.com/posts', {
            userId: 1,
            title: 'foo',
            body: 'bar'
        });

        expect(response.data).toMatchObject({
            id: 101
        });
    });

    it('send put request', async () => {
        const response = await fetchClient.put('https://jsonplaceholder.typicode.com/posts/1', {
            userId: 1,
            title: 'foo'
        });

        expect(response.data).toMatchObject({
            id: 1
        });
    });
});
