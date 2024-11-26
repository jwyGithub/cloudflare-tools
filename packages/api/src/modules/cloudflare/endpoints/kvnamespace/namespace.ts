import type { IApiContent } from './types';
import { BASE_URL, urlParse } from './shared';

export const NAMESPACE_MODULE_URL = '/accounts/{{account_id}}/storage/kv/namespaces';
/**
 * @description List Namespaces
 * @method GET
 * @link /accounts/{{account_id}}/storage/kv/namespaces
 * @param {IApiContent} values 替换参数
 * @returns {string} 返回格式化后的URL
 */
export function getNamespaceList(values: IApiContent): string {
    return urlParse(`${BASE_URL}${NAMESPACE_MODULE_URL}`, values);
}

/**
 * @description Create a Namespace
 * @method Post
 * @link /accounts/{{account_id}}/storage/kv/namespaces
 * @param {IApiContent} values 替换参数
 * @returns {string} 返回格式化后的URL
 */
export function createNamespace(values: IApiContent): string {
    return getNamespaceList(values);
}

/**
 * @description Get a Namespace
 * @method Get
 * @link /accounts/{{account_id}}/storage/kv/namespaces/{namespace_id}
 * @param {IApiContent} values 替换参数
 * @returns {string} 返回格式化后的URL
 */
export function getNamespace(values: IApiContent): string {
    return urlParse(`${getNamespaceList(values)}/{{namespace_id}}`, values);
}

/**
 * @description Rename a Namespace
 * @method Get
 * @link /accounts/{{account_id}}/storage/kv/namespaces/{namespace_id}
 * @param {IApiContent} values 替换参数
 * @returns {string} 返回格式化后的URL
 */
export function renameNamespace(values: IApiContent): string {
    return urlParse(`${getNamespaceList(values)}/{{namespace_id}}`, values);
}

/**
 * @description Remove a Namespace
 * @method DELETE
 * @link /accounts/{account_id}/storage/kv/namespaces/{namespace_id}
 * @param {IApiContent} values 替换参数
 * @returns {string} 返回格式化后的URL
 */
export function removeNamespace(values: IApiContent): string {
    return urlParse(`${getNamespaceList(values)}/{{namespace_id}}`, values);
}

/**
 * @description List a Namespace's Keys
 * @method GET
 * @link /accounts/{account_id}/storage/kv/namespaces/{namespace_id}/keys
 * @param {IApiContent} values 替换参数
 * @returns {string} 返回格式化后的URL
 */
export function getNamespaceKeys(values: IApiContent): string {
    return urlParse(`${getNamespaceList(values)}/{{namespace_id}}/keys`, values);
}

/**
 * @description Read key-value pair
 * @method Get
 * @link /accounts/{account_id}/storage/kv/namespaces/{namespace_id}/values/{key_name}
 * @param {IApiContent} values 替换参数
 * @returns {string} 返回格式化后的URL
 */
export function getNamespaceValue(values: IApiContent): string {
    return urlParse(`${getNamespace(values)}/values/{{key_name}}`, values);
}

/**
 * @description Write key-value pair with optional metadata
 * @method Put
 * @link /accounts/{account_id}/storage/kv/namespaces/{namespace_id}/values/{key_name}
 * @param {IApiContent} values 替换参数
 * @returns {string} 返回格式化后的URL
 */
export function writeNamespaceValue(values: IApiContent): string {
    return urlParse(`${getNamespace(values)}/values/{{key_name}}`, values);
}

/**
 * @description Delete key-value pair
 * @method DELETE
 * @link /accounts/{account_id}/storage/kv/namespaces/{namespace_id}/values/{key_name}
 * @param {IApiContent} values 替换参数
 * @returns {string} 返回格式化后的URL
 */
export function deleteNamespaceValue(values: IApiContent): string {
    return urlParse(`${getNamespace(values)}/values/{{key_name}}`, values);
}

/**
 * @description Delete multiple key-value pairs
 * @method POST
 * @link /accounts/{account_id}/storage/kv/namespaces/{namespace_id}/bulk/delete
 * @param {IApiContent} values 替换参数
 * @returns {string} 返回格式化后的URL
 */
export function deleteMultipleNamespaceValue(values: IApiContent): string {
    return urlParse(`${getNamespace(values)}/bulk/delete`, values);
}

/**
 * @description Write multiple key-value pairs
 * @method POST
 * @link /accounts/{account_id}/storage/kv/namespaces/{namespace_id}/bulk
 * @param {IApiContent} values 替换参数
 * @returns {string} 返回格式化后的URL
 */
export function writeMultipleNamespaceValue(values: IApiContent): string {
    return urlParse(`${getNamespace(values)}/bulk`, values);
}
