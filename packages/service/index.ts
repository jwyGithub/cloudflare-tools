import {
    RESPONSE_CLIENT_ERROR_CODE,
    RESPONSE_CLIENT_ERROR_MESSAGE,
    RESPONSE_GATEWAY_TIMEOUT_CODE,
    RESPONSE_GATEWAY_TIMEOUT_MESSAGE,
    RESPONSE_JSON_HEADER,
    RESPONSE_NOT_FOUND_CODE,
    RESPONSE_NOT_FOUND_MESSAGE,
    RESPONSE_SERVER_ERROR_CODE,
    RESPONSE_SERVER_ERROR_MESSAGE,
    RESPONSE_STREAM_HEADER,
    RESPONSE_SUCCESS_CODE,
    RESPONSE_SUCCESS_MESSAGE,
    RESPONSE_UNAUTHORIZED_CODE,
    RESPONSE_UNAUTHORIZED_MESSAGE
} from './src/lib';
import type { RESPONSE_CODE } from './src/lib';

export * from './src/lib';

/**
 * Creates a successful HTTP response with the given data and message.
 *
 * @param data - The data to include in the response body.
 * @param message - The message to include in the response body and status text. Defaults to `RESPONSE_SUCCESS_MESSAGE`.
 * @param headers - Optional. The headers to include in the response. Defaults to `RESPONSE_JSON_HEADER`.
 * @returns A `Response` object with a JSON body containing the status, message, and data.
 */
export const toSuccess = (data: any, message: string = RESPONSE_SUCCESS_MESSAGE, headers: Headers = RESPONSE_JSON_HEADER): Response => {
    return new Response(
        JSON.stringify({
            status: RESPONSE_SUCCESS_CODE,
            message,
            data
        }),
        {
            status: RESPONSE_SUCCESS_CODE,
            statusText: message,
            headers
        }
    );
};

/**
 * Converts the provided data into a Response stream.
 *
 * @param data - The body of the response. This can be any type that is valid for the BodyInit type.
 * @param headers - Optional. The headers to include in the response. Defaults to RESPONSE_STREAM_HEADER.
 * @returns A Response object with the provided data, status, status text, and headers.
 */
export const toStream = (data: BodyInit, headers: Headers = RESPONSE_STREAM_HEADER): Response => {
    return new Response(data, {
        status: RESPONSE_SUCCESS_CODE,
        headers
    });
};

/**
 * Converts a reason and code into a client error response.
 *
 * @param reason - The error message to be sent to the client. Defaults to `RESPONSE_CLIENT_ERROR_MESSAGE`.
 * @param code - The HTTP status code for the error. Defaults to `RESPONSE_CLIENT_ERROR_CODE`.
 * @param headers - Optional. The headers to include in the response. Defaults to `RESPONSE_JSON_HEADER`.
 * @returns A `Response` object containing the error message and status code.
 */
export const toClientError = (
    reason: string = RESPONSE_CLIENT_ERROR_MESSAGE,
    code: RESPONSE_CODE = RESPONSE_CLIENT_ERROR_CODE,
    headers: Headers = RESPONSE_JSON_HEADER
): Response => {
    return new Response(
        JSON.stringify({
            status: code,
            message: reason
        }),
        {
            status: code,
            statusText: reason,
            headers
        }
    );
};

/**
 * Generates a `Response` object representing a "Not Found" error.
 *
 * @param reason - The reason message for the "Not Found" error. Defaults to `RESPONSE_NOT_FOUND_MESSAGE`.
 * @param code - The HTTP status code for the "Not Found" error. Defaults to `RESPONSE_NOT_FOUND_CODE`.
 * @returns A `Response` object with the specified status code and reason message.
 */
export const toNotFound = (
    reason: string = RESPONSE_NOT_FOUND_MESSAGE,
    code: RESPONSE_CODE = RESPONSE_NOT_FOUND_CODE,
    headers: Headers = RESPONSE_JSON_HEADER
): Response => {
    return new Response(
        JSON.stringify({
            status: code,
            message: reason
        }),
        {
            status: code,
            statusText: reason,
            headers
        }
    );
};

/**
 * Generates an unauthorized response.
 *
 * @param reason - The reason for the unauthorized response. Defaults to `RESPONSE_UNAUTHORIZED_MESSAGE`.
 * @param code - The response code. Defaults to `RESPONSE_UNAUTHORIZED_CODE`.
 * @param headers - Optional. The headers to include in the response. Defaults to `RESPONSE_JSON_HEADER`.
 * @returns A `Response` object with the specified status code and reason.
 */
export const toUnauthorized = (
    reason: string = RESPONSE_UNAUTHORIZED_MESSAGE,
    code: RESPONSE_CODE = RESPONSE_UNAUTHORIZED_CODE,
    headers: Headers = RESPONSE_JSON_HEADER
): Response => {
    return new Response(
        JSON.stringify({
            status: code,
            message: reason
        }),
        {
            status: code,
            statusText: reason,
            headers
        }
    );
};

/**
 * Creates a new Response object representing a Gateway Timeout error.
 *
 * @param reason - The reason message for the timeout. Defaults to `RESPONSE_GATEWAY_TIMEOUT_MESSAGE`.
 * @param code - The status code for the timeout. Defaults to `RESPONSE_GATEWAY_TIMEOUT_CODE`.
 * @param headers - Optional. The headers to include in the response. Defaults to `RESPONSE_JSON_HEADER`.
 * @returns A Response object with the specified status code and reason message.
 */
export const toGatewayTimeout = (
    reason: string = RESPONSE_GATEWAY_TIMEOUT_MESSAGE,
    code: RESPONSE_CODE = RESPONSE_GATEWAY_TIMEOUT_CODE,
    headers: Headers = RESPONSE_JSON_HEADER
): Response => {
    return new Response(
        JSON.stringify({
            status: code,
            message: reason
        }),
        {
            status: code,
            statusText: reason,
            headers
        }
    );
};

/**
 * Converts the provided reason and code into a server error response.
 *
 * @param reason - The error message to be included in the response. Defaults to `RESPONSE_SERVER_ERROR_MESSAGE`.
 * @param code - The HTTP status code for the error response. Defaults to `RESPONSE_SERVER_ERROR_CODE`.
 * @param headers - Optional. The headers to include in the response. Defaults to `RESPONSE_JSON_HEADER`.
 * @returns A `Response` object containing the error details.
 */
export const toServerError = (
    reason: string = RESPONSE_SERVER_ERROR_MESSAGE,
    code: RESPONSE_CODE = RESPONSE_SERVER_ERROR_CODE,
    headers: Headers = RESPONSE_JSON_HEADER
): Response => {
    return new Response(
        JSON.stringify({
            status: code,
            message: reason
        }),
        {
            status: code,
            statusText: reason,
            headers
        }
    );
};

/**
 * Converts a given reason and code into an HTTP Response object representing an unknown error.
 *
 * @param reason - The error message to be included in the response. Defaults to `RESPONSE_SERVER_ERROR_MESSAGE`.
 * @param code - The HTTP status code to be included in the response. Defaults to `RESPONSE_SERVER_ERROR_CODE`.
 * @param headers - Optional. The headers to include in the response. Defaults to `RESPONSE_JSON_HEADER`.
 * @returns A `Response` object containing the error message and status code.
 */
export const toUnknownError = (
    reason: string = RESPONSE_SERVER_ERROR_MESSAGE,
    code: RESPONSE_CODE = RESPONSE_SERVER_ERROR_CODE,
    headers: Headers = RESPONSE_JSON_HEADER
): Response => {
    return new Response(
        JSON.stringify({
            status: code,
            message: reason
        }),
        {
            status: code,
            statusText: reason,
            headers
        }
    );
};
