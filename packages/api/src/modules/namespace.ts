import { BASE_URL, CloudflareAPI } from '../lib';
import type { IApiContent } from '../types';

export class Namespace extends CloudflareAPI {
    public static MODULE_URL = '/accounts/{{account_id}}/storage/kv/namespaces';

    /**
     * @description 获取所有namespace
     * @param {IApiContent} values 替换参数
     * @returns {string} 返回格式化后的URL
     */
    public static GET_ALL(values: Pick<IApiContent, 'account_id'>): string {
        return this.format(`${BASE_URL}${this.MODULE_URL}`, values);
    }

    /**
     * @description 获取所有namespace keys
     * @param {IApiContent} values 替换参数
     * @returns {string} 返回格式化后的URL
     */
    public static GET_KEYS(values: Pick<IApiContent, 'account_id' | 'kvnamespace'>): string {
        return this.format(`${this.GET_ALL(values)}/{{kvnamespace}}/keys`, values);
    }

    /**
     * @description 获取所有value
     * @param {IApiContent} values 替换参数
     * @returns {string} 返回格式化后的URL
     */
    public static GET_VALUE(values: IApiContent): string {
        return this.format(`${this.GET_ALL(values)}/{{kvnamespace}}/values/{{value}}`, values);
    }
}

export class NamespaceMap {
    static MODULE = 'namespace';

    static GET_ALL = `/api/${this.MODULE}/get_all`;

    static GET_KEYS = `/api/${this.MODULE}/get_keys`;

    static GET_VALUE = `/api/${this.MODULE}/get_value`;

    static URL_MAP = new Map<string, (v: IApiContent) => string>([
        [this.GET_ALL, Namespace.GET_ALL],
        [this.GET_KEYS, Namespace.GET_KEYS],
        [this.GET_VALUE, Namespace.GET_VALUE]
    ]);

    static find(key: INamespaceMapKey, values: IApiContent = {}) {
        const url = this.URL_MAP.get(this[key]);
        if (!url) {
            throw new Error(`NamespaceMap URL_MAP not found key: ${key}`);
        }

        return url.call(Namespace, values);
    }
}

export type INamespaceMapKey = Exclude<keyof typeof NamespaceMap, 'MODULE' | 'prototype' | 'find' | 'URL_MAP'>;
