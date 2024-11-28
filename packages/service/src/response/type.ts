import type { RESPONSE_CODE } from '../lib';
import {
    RESPONSE_CLIENT_ERROR_CODE,
    RESPONSE_CLIENT_ERROR_MESSAGE,
    RESPONSE_GATEWAY_TIMEOUT_CODE,
    RESPONSE_GATEWAY_TIMEOUT_MESSAGE,
    RESPONSE_HTML_HEADER,
    RESPONSE_JSON_HEADER,
    RESPONSE_NOT_FOUND_CODE,
    RESPONSE_NOT_FOUND_MESSAGE,
    RESPONSE_SERVER_ERROR_CODE,
    RESPONSE_SERVER_ERROR_MESSAGE,
    RESPONSE_STREAM_HEADER,
    RESPONSE_SUCCESS_CODE,
    RESPONSE_SUCCESS_MESSAGE,
    RESPONSE_TEXT_HEADER,
    RESPONSE_UNAUTHORIZED_CODE,
    RESPONSE_UNAUTHORIZED_MESSAGE
} from '../lib';

/**
 * 创建一个包含给定数据和消息的成功HTTP响应。
 *
 * @param data - 要包含在响应体中的数据。
 * @param message - 要包含在响应体和状态文本中的消息。默认为 `RESPONSE_SUCCESS_MESSAGE`。
 * @param headers - 可选。要包含在响应中的头信息。默认为 `RESPONSE_JSON_HEADER`。
 * @returns 一个包含状态、消息和数据的JSON体的 `Response` 对象。
 */
export const toSuccess = (data: any, message: string = RESPONSE_SUCCESS_MESSAGE, headers: Headers = RESPONSE_JSON_HEADER): Response => {
    return Response.json(
        {
            status: RESPONSE_SUCCESS_CODE,
            message,
            data
        },
        {
            status: RESPONSE_SUCCESS_CODE,
            statusText: message,
            headers
        }
    );
};

/**
 * 将提供的数据转换为响应流。
 *
 * @param data - 响应的主体。可以是任何有效的 BodyInit 类型。
 * @param headers - 可选。要包含在响应中的头信息。默认为 `RESPONSE_STREAM_HEADER`。
 * @returns 一个包含提供的数据、状态、状态文本和头信息的 `Response` 对象。
 */
export const toStream = (data: BodyInit | null, headers: Headers = RESPONSE_STREAM_HEADER): Response => {
    return new Response(data, {
        status: RESPONSE_SUCCESS_CODE,
        headers
    });
};

/**
 * 发送静态资源
 *
 * @param data - 响应的主体。可以是任何有效的 BodyInit 类型。
 * @param headers - 可选。要包含在响应中的头信息。默认为 `RESPONSE_STREAM_HEADER`。
 * @returns 一个包含提供的数据、状态、状态文本和头信息的 `Response` 对象。
 */
export const toStatic = (data: BodyInit | null, headers: Headers = RESPONSE_TEXT_HEADER): Response => {
    return new Response(data, {
        headers,
        status: RESPONSE_SUCCESS_CODE
    });
};

/**
 * 发送页面
 *
 * @param data - 响应的主体。可以是任何有效的 BodyInit 类型。
 * @param headers - 可选。要包含在响应中的头信息。默认为 `RESPONSE_STREAM_HEADER`。
 * @returns 一个包含提供的数据、状态、状态文本和头信息的 `Response` 对象。
 */
export const toHTML = (data: BodyInit | null, headers: Headers = RESPONSE_HTML_HEADER): Response => {
    return new Response(data, {
        headers
    });
};

/**
 * 将提供的原因和代码转换为客户端错误响应。
 *
 * @param reason - 要发送给客户端的错误消息。默认为 `RESPONSE_CLIENT_ERROR_MESSAGE`。
 * @param code - 错误的HTTP状态码。默认为 `RESPONSE_CLIENT_ERROR_CODE`。
 * @param headers - 可选。要包含在响应中的头信息。默认为 `RESPONSE_JSON_HEADER`。
 * @returns 一个包含错误消息和状态码的 `Response` 对象。
 */
export const toClientError = (
    reason: string = RESPONSE_CLIENT_ERROR_MESSAGE,
    code: RESPONSE_CODE = RESPONSE_CLIENT_ERROR_CODE,
    headers: Headers = RESPONSE_JSON_HEADER
): Response => {
    return Response.json(
        {
            status: code,
            message: reason
        },
        {
            status: code,
            statusText: reason,
            headers
        }
    );
};

/**
 * 生成一个表示“未找到”错误的 `Response` 对象。
 *
 * @param reason - “未找到”错误的原因消息。默认为 `RESPONSE_NOT_FOUND_MESSAGE`。
 * @param code - “未找到”错误的HTTP状态码。默认为 `RESPONSE_NOT_FOUND_CODE`。
 * @returns 一个包含指定状态码和原因消息的 `Response` 对象。
 */
export const toNotFound = (
    reason: string = RESPONSE_NOT_FOUND_MESSAGE,
    code: RESPONSE_CODE = RESPONSE_NOT_FOUND_CODE,
    headers: Headers = RESPONSE_JSON_HEADER
): Response => {
    return Response.json(
        {
            status: code,
            message: reason
        },
        {
            status: code,
            statusText: reason,
            headers
        }
    );
};

/**
 * 生成一个未授权的响应。
 *
 * @param reason - 未授权响应的原因。默认为 `RESPONSE_UNAUTHORIZED_MESSAGE`。
 * @param code - 响应码。默认为 `RESPONSE_UNAUTHORIZED_CODE`。
 * @param headers - 可选。要包含在响应中的头信息。默认为 `RESPONSE_JSON_HEADER`。
 * @returns 一个包含指定状态码和原因的 `Response` 对象。
 */
export const toUnauthorized = (
    reason: string = RESPONSE_UNAUTHORIZED_MESSAGE,
    code: RESPONSE_CODE = RESPONSE_UNAUTHORIZED_CODE,
    headers: Headers = RESPONSE_JSON_HEADER
): Response => {
    return Response.json(
        {
            status: code,
            message: reason
        },
        {
            status: code,
            statusText: reason,
            headers
        }
    );
};

/**
 * 创建一个表示网关超时错误的 `Response` 对象。
 *
 * @param reason - 超时的原因消息。默认为 `RESPONSE_GATEWAY_TIMEOUT_MESSAGE`。
 * @param code - 超时的状态码。默认为 `RESPONSE_GATEWAY_TIMEOUT_CODE`。
 * @param headers - 可选。要包含在响应中的头信息。默认为 `RESPONSE_JSON_HEADER`。
 * @returns 一个包含指定状态码和原因消息的 `Response` 对象。
 */
export const toGatewayTimeout = (
    reason: string = RESPONSE_GATEWAY_TIMEOUT_MESSAGE,
    code: RESPONSE_CODE = RESPONSE_GATEWAY_TIMEOUT_CODE,
    headers: Headers = RESPONSE_JSON_HEADER
): Response => {
    return Response.json(
        {
            status: code,
            message: reason
        },
        {
            status: code,
            statusText: reason,
            headers
        }
    );
};

/**
 * 将提供的原因和代码转换为服务器错误响应。
 *
 * @param reason - 要包含在响应中的错误消息。默认为 `RESPONSE_SERVER_ERROR_MESSAGE`。
 * @param code - 错误响应的HTTP状态码。默认为 `RESPONSE_SERVER_ERROR_CODE`。
 * @param headers - 可选。要包含在响应中的头信息。默认为 `RESPONSE_JSON_HEADER`。
 * @returns 一个包含错误详情的 `Response` 对象。
 */
export const toServerError = (
    reason: string = RESPONSE_SERVER_ERROR_MESSAGE,
    code: RESPONSE_CODE = RESPONSE_SERVER_ERROR_CODE,
    headers: Headers = RESPONSE_JSON_HEADER
): Response => {
    return Response.json(
        {
            status: code,
            message: reason
        },
        {
            status: code,
            statusText: reason,
            headers
        }
    );
};

/**
 * 将给定的原因和代码转换为表示未知错误的HTTP响应对象。
 *
 * @param reason - 要包含在响应中的错误消息。默认为 `RESPONSE_SERVER_ERROR_MESSAGE`。
 * @param code - 要包含在响应中的HTTP状态码。默认为 `RESPONSE_SERVER_ERROR_CODE`。
 * @param headers - 可选。要包含在响应中的头信息。默认为 `RESPONSE_JSON_HEADER`。
 * @returns 一个包含错误消息和状态码的 `Response` 对象。
 */
export const toUnknownError = (
    reason: string = RESPONSE_SERVER_ERROR_MESSAGE,
    code: RESPONSE_CODE = RESPONSE_SERVER_ERROR_CODE,
    headers: Headers = RESPONSE_JSON_HEADER
): Response => {
    return Response.json(
        {
            status: code,
            message: reason
        },
        {
            status: code,
            statusText: reason,
            headers
        }
    );
};
