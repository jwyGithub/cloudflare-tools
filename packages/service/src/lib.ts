export type RESPONSE_TYPE =
    | 'success'
    | 'error'
    | 'not_found'
    | 'unauthorized'
    | 'bad_request'
    | 'gateway_timeout'
    | 'unknown_error'
    | (string & {});

export type RESPONSE_CODE = 200 | 400 | 404 | 401 | 504 | 500 | (number & {});

/**
 * @description success response code.
 */
export const RESPONSE_SUCCESS_CODE = 200;

/**
 * @description client error response code.
 */
export const RESPONSE_CLIENT_ERROR_CODE = 400;

/**
 * @description not found response code.
 */
export const RESPONSE_NOT_FOUND_CODE = 404;

/**
 * @description unauthorized response code.
 */
export const RESPONSE_UNAUTHORIZED_CODE = 401;

/**
 * @description gateway timeout response code.
 */
export const RESPONSE_GATEWAY_TIMEOUT_CODE = 504;

/**
 * @description server error response code.
 */
export const RESPONSE_SERVER_ERROR_CODE = 500;

/**
 * @description success response message.
 */
export const RESPONSE_SUCCESS_MESSAGE = 'success';

/**
 * @description client error response message.
 */
export const RESPONSE_CLIENT_ERROR_MESSAGE = 'bad request';

/**
 * @description not found response message.
 */
export const RESPONSE_NOT_FOUND_MESSAGE = 'not found';

/**
 * @description unauthorized response message.
 */

export const RESPONSE_UNAUTHORIZED_MESSAGE = 'unauthorized';

/**
 * @description gateway timeout response message.
 */
export const RESPONSE_GATEWAY_TIMEOUT_MESSAGE = 'gateway timeout';

/**
 * @description server error response message.
 */
export const RESPONSE_SERVER_ERROR_MESSAGE = 'internal server error';

/**
 * @description json response header.
 */
// export const RESPONSE_JSON_HEADER = {
//     'Content-type': 'application/json'
// };
export const RESPONSE_JSON_HEADER = new Headers({
    'Content-type': 'application/json'
});

/**
 * @description stream response header.
 */
export const RESPONSE_STREAM_HEADER = new Headers({
    'Content-type': 'application/octet-stream'
});

/**
 * @description text response header.
 */
export const RESPONSE_TEXT_HEADER = new Headers({
    'Content-type': 'text/plain'
});

/**
 * @description html response header.
 */
export const RESPONSE_HTML_HEADER = new Headers({
    'Content-type': 'text/html'
});
