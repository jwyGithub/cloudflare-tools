import { describe, it, expect } from 'vitest';
import { User, Namespace, BASE_URL, NamespaceMap, UserMap } from '../index';
import type { IApiContent } from '../index';

const values: IApiContent = {
    account_id: 'account_id_value',
    kvnamespace: 'kvnamespace_value',
    value: 'value_value'
};

describe('API', () => {
    it('verify token', async () => {
        const url = User.VERIFY_TOKEN();
        expect(url).toBe(BASE_URL + User.MODULE_URL + '/tokens/verify');
    });

    it('get all namespace', async () => {
        const url = Namespace.GET_ALL(values);
        expect(url).toBe(BASE_URL + '/accounts/account_id_value/storage/kv/namespaces');
    });

    it('get namespace keys', async () => {
        const url = Namespace.GET_KEYS(values);
        expect(url).toBe(BASE_URL + '/accounts/account_id_value/storage/kv/namespaces/kvnamespace_value/keys');
    });

    it('get namespace value', async () => {
        const url = Namespace.GET_VALUE(values);
        expect(url).toBe(BASE_URL + '/accounts/account_id_value/storage/kv/namespaces/kvnamespace_value/values/value_value');
    });
});

describe('url map', () => {
    it('verify token', async () => {
        const cloudflare_url = UserMap.find('VERIFY_TOKEN');
        expect(cloudflare_url).toBe(BASE_URL + `/user/tokens/verify`);
    });

    it('get GET_ALL url', async () => {
        const cloudflare_url = NamespaceMap.find('GET_ALL', values);
        expect(cloudflare_url).toBe(BASE_URL + `/accounts/account_id_value/storage/kv/namespaces`);
    });

    it('get GET_KEYS url', async () => {
        const cloudflare_url = NamespaceMap.find('GET_KEYS', values);
        expect(cloudflare_url).toBe(BASE_URL + `/accounts/account_id_value/storage/kv/namespaces/kvnamespace_value/keys`);
    });

    it('get GET_VALUE url', async () => {
        const cloudflare_url = NamespaceMap.find('GET_VALUE', values);
        expect(cloudflare_url).toBe(BASE_URL + `/accounts/account_id_value/storage/kv/namespaces/kvnamespace_value/values/value_value`);
    });
});
