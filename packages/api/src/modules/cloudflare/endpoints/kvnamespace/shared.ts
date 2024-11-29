import type { IApiContent } from './types';

export const BASE_URL = 'https://api.cloudflare.com/client/v4';

export const MATCH_REG = /\{\{(.*?)\}\}/g;

/**
 * @description 格式化URL
 * @param {string} url URL
 * @param {IApiContent} values 替换参数
 * @returns {string} 返回格式化后的URL
 */
export function urlParse(url: string, values: IApiContent): string {
    return url.replace(MATCH_REG, (_: string, key) => values[key] ?? `{{${key}}}`);
}
