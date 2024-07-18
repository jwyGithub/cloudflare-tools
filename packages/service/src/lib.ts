export type RESPONSE_TYPE = 'success' | 'error' | 'not_found' | 'unauthorized' | 'bad_request' | 'gateway_timeout' | 'unknown_error';

export type RESPONSE_CODE = 200 | 400 | 404 | 401 | 504 | 500;

export class ServiceReponseCode {
    static SUCCESS_CODE: RESPONSE_CODE = 200;

    static CLIENT_ERROR_CODE: RESPONSE_CODE = 400;

    static NOT_FOUND_CODE: RESPONSE_CODE = 404;

    static UNAUTHORIZED_CODE: RESPONSE_CODE = 401;

    static GATEWAY_TIMEOUT_CODE: RESPONSE_CODE = 504;

    static SERVER_ERROR_CODE: RESPONSE_CODE = 500;
}

export class ServiceReponseMessage {
    static SUCCESS_MESSAGE: string = 'Success';

    static CLIENT_ERROR_MESSAGE: string = 'Bad Request';

    static NOT_FOUND_MESSAGE: string = 'Not Found';

    static UNAUTHORIZED_MESSAGE: string = 'Unauthorized';

    static GATEWAY_TIMEOUT_MESSAGE: string = 'Gateway Timeout';

    static SERVER_ERROR_MESSAGE: string = 'Internal Server Error';
}

export class ServiceResponseHeader {
    static JSON() {
        return new Headers({
            'Content-type': 'application/json'
        });
    }

    static STREAM() {
        return new Headers({
            'Content-type': 'application/octet-stream'
        });
    }

    static TEXT() {
        return new Headers({
            'Content-type': 'text/plain'
        });
    }
}
