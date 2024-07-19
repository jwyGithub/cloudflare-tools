import { ServiceReponseCode, ServiceReponseMessage, ServiceResponseHeader } from './src/lib';
import type { RESPONSE_CODE } from './src/lib.ts';

export class Service {
    public static success(data: any, message: string = ServiceReponseMessage.SUCCESS_MESSAGE): Response {
        return new Response(
            JSON.stringify({
                status: ServiceReponseCode.SUCCESS_CODE,
                message,
                data
            }),
            {
                status: ServiceReponseCode.SUCCESS_CODE,
                statusText: message,
                headers: ServiceResponseHeader.JSON()
            }
        );
    }

    public static stream(data: Blob, message: string = ServiceReponseMessage.SUCCESS_MESSAGE): Response {
        return new Response(data, {
            status: ServiceReponseCode.SUCCESS_CODE,
            statusText: message,
            headers: ServiceResponseHeader.STREAM()
        });
    }

    public static clientError(
        reason: string = ServiceReponseMessage.CLIENT_ERROR_MESSAGE,
        code: RESPONSE_CODE = ServiceReponseCode.CLIENT_ERROR_CODE
    ): Response {
        return new Response(
            JSON.stringify({
                status: code,
                message: reason
            }),
            {
                status: code,
                statusText: reason,
                headers: ServiceResponseHeader.JSON()
            }
        );
    }

    public static notFound(
        reason: string = ServiceReponseMessage.NOT_FOUND_MESSAGE,
        code: RESPONSE_CODE = ServiceReponseCode.NOT_FOUND_CODE
    ): Response {
        return new Response(
            JSON.stringify({
                status: code,
                message: reason
            }),
            {
                status: code,
                statusText: reason,
                headers: ServiceResponseHeader.JSON()
            }
        );
    }

    public static unauthorized(
        reason: string = ServiceReponseMessage.UNAUTHORIZED_MESSAGE,
        code: RESPONSE_CODE = ServiceReponseCode.UNAUTHORIZED_CODE
    ): Response {
        return new Response(
            JSON.stringify({
                status: code,
                message: reason
            }),
            {
                status: code,
                statusText: reason,
                headers: ServiceResponseHeader.JSON()
            }
        );
    }

    public static gatewayTimeout(
        reason: string = ServiceReponseMessage.GATEWAY_TIMEOUT_MESSAGE,
        code: RESPONSE_CODE = ServiceReponseCode.GATEWAY_TIMEOUT_CODE
    ): Response {
        return new Response(
            JSON.stringify({
                status: code,
                message: reason
            }),
            {
                status: code,
                statusText: reason,
                headers: ServiceResponseHeader.JSON()
            }
        );
    }

    public static serverError(
        reason: string = ServiceReponseMessage.SERVER_ERROR_MESSAGE,
        code: RESPONSE_CODE = ServiceReponseCode.SERVER_ERROR_CODE
    ): Response {
        return new Response(
            JSON.stringify({
                status: code,
                message: reason
            }),
            {
                status: code,
                statusText: reason,
                headers: ServiceResponseHeader.JSON()
            }
        );
    }

    public static unknownError(
        reason: string = ServiceReponseMessage.SERVER_ERROR_MESSAGE,
        code: RESPONSE_CODE = ServiceReponseCode.SERVER_ERROR_CODE
    ): Response {
        return new Response(
            JSON.stringify({
                status: code,
                message: reason
            }),
            {
                status: code,
                statusText: reason,
                headers: ServiceResponseHeader.JSON()
            }
        );
    }
}
