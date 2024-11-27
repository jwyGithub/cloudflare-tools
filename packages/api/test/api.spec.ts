import type { IApiContent } from '../src/index';
import { describe, expect, it } from 'vitest';
import * as api from '../src/index';
import { NAMESPACE_MODULE_URL } from '../src/modules/cloudflare/endpoints/kvnamespace/namespace';
import { BASE_URL } from '../src/modules/cloudflare/endpoints/kvnamespace/shared';
import { urlParse } from '../src/modules/cloudflare/utils';

const values: IApiContent = {
    account_id: 'account_id_value',
    kvnamespace: 'test_namespace',
    value: 'test_value',
    key_name: 'test_key'
};

describe('router', () => {
    it('create namespace', async () => {
        const [router, request] = api.CREATE_NAMESPACE as api.ApiMap;
        const cloudflare_url = request(values);

        expect(router).toBe(`/api/namespace/${request.name}`);
        expect(cloudflare_url).toBe(`${BASE_URL}${urlParse(NAMESPACE_MODULE_URL, values)}`);
    });

    it('remove namespace', async () => {
        const [router, request] = api.REMOVE_NAMESPACE as api.ApiMap;
        const cloudflare_url = request(values);

        expect(router).toBe(`/api/namespace/${request.name}`);
        expect(cloudflare_url).toBe(`${BASE_URL}${urlParse(`${NAMESPACE_MODULE_URL}/{{kvnamespace}}`, values)}`);
    });

    it('get all namespace', async () => {
        const [router, request] = api.GET_ALL_NAMESPACE as api.ApiMap;
        const cloudflare_url = request(values);

        expect(router).toBe(`/api/namespace/${request.name}`);
        expect(cloudflare_url).toBe(`${BASE_URL}${urlParse(NAMESPACE_MODULE_URL, values)}`);
    });

    it('get namespace keys', async () => {
        const [router, request] = api.GET_NAMESPACE_KEYS as api.ApiMap;
        const cloudflare_url = request(values);

        expect(router).toBe(`/api/namespace/${request.name}`);
        expect(cloudflare_url).toBe(`${BASE_URL}${urlParse(`${NAMESPACE_MODULE_URL}/{{kvnamespace}}/keys`, values)}`);
    });

    it('get namespace value', async () => {
        const [router, request] = api.GET_NAMESPACE_VALUE as api.ApiMap;
        const cloudflare_url = request(values);

        expect(router).toBe(`/api/namespace/${request.name}`);
        expect(cloudflare_url).toBe(`${BASE_URL}${urlParse(`${NAMESPACE_MODULE_URL}/{{kvnamespace}}/values/{{value}}`, values)}`);
    });

    it('create namespace value', async () => {
        const [router, request] = api.CREATE_NAMESPACE_VALUE as api.ApiMap;
        const cloudflare_url = request(values);

        expect(router).toBe(`/api/namespace/${request.name}`);
        expect(cloudflare_url).toBe(`${BASE_URL}${urlParse(`${NAMESPACE_MODULE_URL}/{{kvnamespace}}/values/{key_name}`, values)}`);
    });

    it('remove namespace value', async () => {
        const [router, request] = api.REMOVE_NAMESPACE_VALUE as api.ApiMap;
        const cloudflare_url = request(values);

        expect(router).toBe(`/api/namespace/${request.name}`);
        expect(cloudflare_url).toBe(`${BASE_URL}${urlParse(`${NAMESPACE_MODULE_URL}/{{kvnamespace}}/values/{{value}}`, values)}`);
    });
});
