import {
    createNamespace,
    deleteMultipleNamespaceValue,
    deleteNamespaceValue,
    getNamespace,
    getNamespaceKeys,
    getNamespaceList,
    getNamespaceValue,
    removeNamespace,
    renameNamespace,
    writeMultipleNamespaceValue,
    writeNamespaceValue
} from './namespace';

export const getModule = (api: string) => `/api/namespace/${api}`;

/**
 * @description 获取所有namespace
 */
export const GET_LIST_NAMESPACE = [getModule(getNamespaceList.name), getNamespaceList];

/**
 * @description 获取namespace
 */
export const GET_NAMESPACE = [getModule(getNamespace.name), getNamespace];

/**
 * @description 重命名namespace
 */
export const RENAME_NAMESPACE = [getModule(renameNamespace.name), renameNamespace];

/**
 * @description 创建namespace
 */
export const CREATE_NAMESPACE = [getModule(createNamespace.name), createNamespace];

/**
 * @description 删除namespace
 */
export const REMOVE_NAMESPACE = [getModule(removeNamespace.name), removeNamespace];

/**
 * @description 获取指定namespace所有 keys
 */
export const GET_NAMESPACE_KEYS = [getModule(getNamespaceKeys.name), getNamespaceKeys];

/**
 * @description 获取指定namespace的key的value
 */
export const GET_NAMESPACE_VALUE = [getModule(getNamespaceValue.name), getNamespaceValue];

/**
 * @description 创建指定namespace的key的value
 */
export const CREATE_NAMESPACE_VALUE = [getModule(writeNamespaceValue.name), writeNamespaceValue];

/**
 * @description 删除指定namespace的key的value
 */
export const REMOVE_NAMESPACE_VALUE = [getModule(deleteNamespaceValue.name), deleteNamespaceValue];

/**
 * @description 批量删除指定namespace的key的value
 */
export const REMOVE_MULTIPLE_NAMESPACE_VALUE = [getModule(deleteMultipleNamespaceValue.name), deleteMultipleNamespaceValue];

/**
 * @description 批量创建指定namespace的key的value
 */
export const CREATE_MULTIPLE_NAMESPACE_VALUE = [getModule(writeMultipleNamespaceValue.name), writeMultipleNamespaceValue];
