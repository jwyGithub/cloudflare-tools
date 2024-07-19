import { BASE_URL, CloudflareAPI } from '../lib';
import type { IApiContent } from '../types';

export class Namespace extends CloudflareAPI {
    public static readonly MODULE_URL = '/accounts/{{account_id}}/storage/kv/namespaces';

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
     * @description 创建namespace
     * @param {IApiContent} values 替换参数
     * @returns {string} 返回格式化后的URL
     */
    public static CREATE(values: IApiContent): string {
        return this.format(`${BASE_URL}${this.MODULE_URL}`, values);
    }

    /**
     * @description 删除namespace
     * @param {IApiContent} values 替换参数
     * @returns {string} 返回格式化后的URL
     */
    public static REMOVE(values: Pick<IApiContent, 'account_id' | 'kvnamespace'>): string {
        return this.format(`${BASE_URL}${this.MODULE_URL}/{{kvnamespace}}`, values);
    }

    /**
     * @description 获取value
     * @param {IApiContent} values 替换参数
     * @returns {string} 返回格式化后的URL
     */
    public static GET_VALUE(values: IApiContent): string {
        return this.format(`${this.GET_ALL(values)}/{{kvnamespace}}/values/{{value}}`, values);
    }

    /**
     * @description 创建value
     * @param {IApiContent} values 替换参数
     * @returns {string} 返回格式化后的URL
     */
    public static CREATE_VALUE(values: IApiContent): string {
        return this.format(`${this.GET_ALL(values)}/{{kvnamespace}}/values/{key_name}`, values);
    }

    /**
     * @description 删除value
     * @param {IApiContent} values 替换参数
     * @returns {string} 返回格式化后的URL
     */
    public static REMOVE_VALUE(values: IApiContent): string {
        return this.format(`${this.GET_ALL(values)}/{{kvnamespace}}/values/{{key_name}}`, values);
    }
}

export class NamespaceMap {
    static MODULE = 'namespace';

    /**
     * @description 获取所有namespace
     * @default `/api/namespace/get_all`
     */
    public static readonly GET_ALL = `/api/${this.MODULE}/get_all`;

    /**
     * @description 获取所有namespace keys
     * @default `/api/namespace/get_keys`
     */
    static GET_KEYS = `/api/${this.MODULE}/get_keys`;

    /**
     * @description 创建namespace
     * @default `/api/namespace/create`
     */
    static CREATE = `/api/${this.MODULE}/create`;

    /**
     * @description 删除namespace
     * @default `/api/namespace/remove`
     */
    static REMOVE = `/api/${this.MODULE}/remove`;

    /**
     * @description 获取value
     * @default `/api/namespace/get_value`
     */
    static GET_VALUE = `/api/${this.MODULE}/get_value`;

    /**
     * @description 创建value
     * @default `/api/namespace/create_value`
     */
    static CREATE_VALUE = `/api/${this.MODULE}/create_value`;

    /**
     * @description 删除value
     * @default `/api/namespace/remove_value`
     */
    static REMOVE_VALUE = `/api/${this.MODULE}/remove_value`;

    /**
     * @description 用户模块URL映射
     */
    static URL_MAP = new Map<string, (v: IApiContent) => string>([
        [this.GET_ALL, Namespace.GET_ALL],
        [this.GET_KEYS, Namespace.GET_KEYS],
        [this.GET_VALUE, Namespace.GET_VALUE],
        [this.CREATE, Namespace.CREATE],
        [this.REMOVE, Namespace.REMOVE],
        [this.CREATE_VALUE, Namespace.CREATE_VALUE],
        [this.REMOVE_VALUE, Namespace.REMOVE_VALUE]
    ]);

    /**
     * @description 获取用户模块URL
     * @param {INamespaceMapKey} key
     * @returns {string}
     */
    static find(key: INamespaceMapKey, values: IApiContent = {}): string {
        const url = this.URL_MAP.get(this[key]);
        if (!url) {
            throw new Error(`NamespaceMap URL_MAP not found key: ${key}`);
        }

        return url.call(Namespace, values);
    }
}

export type INamespaceMapKey = Exclude<keyof typeof NamespaceMap, 'MODULE' | 'prototype' | 'find' | 'URL_MAP'>;
