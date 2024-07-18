import { ServiceReponseCode, ServiceReponseMessage, ServiceResponseHeader } from './src/lib';

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

    public static clientError(reason: string = ServiceReponseMessage.CLIENT_ERROR_MESSAGE): Response {
        return new Response(
            JSON.stringify({
                status: ServiceReponseCode.CLIENT_ERROR_CODE,
                message: reason
            }),
            {
                status: ServiceReponseCode.CLIENT_ERROR_CODE,
                statusText: reason,
                headers: ServiceResponseHeader.JSON()
            }
        );
    }

    public static notFound(reason: string = ServiceReponseMessage.NOT_FOUND_MESSAGE): Response {
        return new Response(
            JSON.stringify({
                status: ServiceReponseCode.NOT_FOUND_CODE,
                message: reason
            }),
            {
                status: ServiceReponseCode.NOT_FOUND_CODE,
                statusText: reason,
                headers: ServiceResponseHeader.JSON()
            }
        );
    }

    public static unauthorized(reason: string = ServiceReponseMessage.UNAUTHORIZED_MESSAGE): Response {
        return new Response(
            JSON.stringify({
                status: ServiceReponseCode.UNAUTHORIZED_CODE,
                message: reason
            }),
            {
                status: ServiceReponseCode.UNAUTHORIZED_CODE,
                statusText: reason,
                headers: ServiceResponseHeader.JSON()
            }
        );
    }

    public static gatewayTimeout(reason: string = ServiceReponseMessage.GATEWAY_TIMEOUT_MESSAGE): Response {
        return new Response(
            JSON.stringify({
                status: ServiceReponseCode.GATEWAY_TIMEOUT_CODE,
                message: reason
            }),
            {
                status: ServiceReponseCode.GATEWAY_TIMEOUT_CODE,
                statusText: reason,
                headers: ServiceResponseHeader.JSON()
            }
        );
    }

    public static serverError(reason: string = ServiceReponseMessage.SERVER_ERROR_MESSAGE): Response {
        return new Response(
            JSON.stringify({
                status: ServiceReponseCode.SERVER_ERROR_CODE,
                message: reason
            }),
            {
                status: ServiceReponseCode.SERVER_ERROR_CODE,
                statusText: reason,
                headers: ServiceResponseHeader.JSON()
            }
        );
    }

    public static unknownError(reason: string = ServiceReponseMessage.SERVER_ERROR_MESSAGE): Response {
        return new Response(
            JSON.stringify({
                status: ServiceReponseCode.SERVER_ERROR_CODE,
                message: reason
            }),
            {
                status: ServiceReponseCode.SERVER_ERROR_CODE,
                statusText: reason,
                headers: ServiceResponseHeader.JSON()
            }
        );
    }
}
