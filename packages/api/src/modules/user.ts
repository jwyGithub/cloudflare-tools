import { BASE_URL, CloudflareAPI } from '../lib';

export class User extends CloudflareAPI {
    public static MODULE_URL = '/user';

    /**
     * @description 验证Token
     * @returns {string}
     */
    public static VERIFY_TOKEN(): string {
        // 返回验证token的URL
        return `${BASE_URL}${this.MODULE_URL}/tokens/verify`;
    }
}

export class UserMap {
    static MODULE = 'user';

    static VERIFY_TOKEN = `/api/${this.MODULE}/verify_token`;

    static URL_MAP = new Map<string, () => string>([[this.VERIFY_TOKEN, User.VERIFY_TOKEN]]);

    static find(key: IUserMapKey) {
        const url = this.URL_MAP.get(this[key]);
        if (!url) {
            throw new Error(`UserMap URL_MAP not found key: ${key}`);
        }

        return url.call(User);
    }
}

export type IUserMapKey = Exclude<keyof typeof UserMap, 'MODULE' | 'prototype' | 'find' | 'URL_MAP'>;
