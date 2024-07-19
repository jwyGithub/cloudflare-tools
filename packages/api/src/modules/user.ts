import { BASE_URL, CloudflareAPI } from '../lib';

export class User extends CloudflareAPI {
    public static readonly MODULE_URL = '/user';

    /**
     * @description 验证Token
s     * @returns {string}
     */
    public static VERIFY_TOKEN(): string {
        // 返回验证token的URL
        return `${BASE_URL}${this.MODULE_URL}/tokens/verify`;
    }
}

export class UserMap {
    public static readonly MODULE = 'user';

    /**
     * @description 验证Token
     * @default `/api/user/verify_token`
     */
    public static readonly VERIFY_TOKEN = `/api/${this.MODULE}/verify_token`;

    /**
     * @description 用户模块URL映射
     */
    static URL_MAP = new Map<string, () => string>([[this.VERIFY_TOKEN, User.VERIFY_TOKEN]]);

    /**
     * @description 获取用户模块URL
     * @param {IUserMapKey} key
     * @returns {string}
     */
    static find(key: IUserMapKey): string {
        const url = this.URL_MAP.get(this[key]);
        if (!url) {
            throw new Error(`UserMap URL_MAP not found key: ${key}`);
        }

        return url.call(User);
    }
}

export type IUserMapKey = Exclude<keyof typeof UserMap, 'MODULE' | 'prototype' | 'find' | 'URL_MAP'>;
