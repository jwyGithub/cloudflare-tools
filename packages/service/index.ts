import { ServiceReponseCode, ServiceReponseMessage, ServiceResponseHeader } from './src/lib';

export class Service {
    public static success(data: any): Response {
        return new Response(
            JSON.stringify({
                status: ServiceReponseCode.SUCCESS_CODE,
                message: ServiceReponseMessage.SUCCESS_MESSAGE,
                data
            }),
            {
                status: ServiceReponseCode.SUCCESS_CODE,
                statusText: ServiceReponseMessage.SUCCESS_MESSAGE,
                headers: ServiceResponseHeader.JSON()
            }
        );
    }

    public static clientError(reason: string): Response {
        return new Response(
            JSON.stringify({
                status: ServiceReponseCode.CLIENT_ERROR_CODE,
                message: reason
            }),
            {
                status: ServiceReponseCode.CLIENT_ERROR_CODE,
                statusText: ServiceReponseMessage.CLIENT_ERROR_MESSAGE,
                headers: ServiceResponseHeader.JSON()
            }
        );
    }

    public static notFound(): Response {
        return new Response(
            JSON.stringify({
                status: ServiceReponseCode.NOT_FOUND_CODE,
                message: ServiceReponseMessage.NOT_FOUND_MESSAGE
            }),
            {
                status: ServiceReponseCode.NOT_FOUND_CODE,
                statusText: ServiceReponseMessage.NOT_FOUND_MESSAGE,
                headers: ServiceResponseHeader.JSON()
            }
        );
    }

    public static unauthorized(): Response {
        return new Response(
            JSON.stringify({
                status: ServiceReponseCode.UNAUTHORIZED_CODE,
                message: ServiceReponseMessage.UNAUTHORIZED_MESSAGE
            }),
            {
                status: ServiceReponseCode.UNAUTHORIZED_CODE,
                statusText: ServiceReponseMessage.UNAUTHORIZED_MESSAGE,
                headers: ServiceResponseHeader.JSON()
            }
        );
    }

    public static gatewayTimeout(): Response {
        return new Response(
            JSON.stringify({
                status: ServiceReponseCode.GATEWAY_TIMEOUT_CODE,
                message: ServiceReponseMessage.GATEWAY_TIMEOUT_MESSAGE
            }),
            {
                status: ServiceReponseCode.GATEWAY_TIMEOUT_CODE,
                statusText: ServiceReponseMessage.GATEWAY_TIMEOUT_MESSAGE,
                headers: ServiceResponseHeader.JSON()
            }
        );
    }

    public static serverError(): Response {
        return new Response(
            JSON.stringify({
                status: ServiceReponseCode.SERVER_ERROR_CODE,
                message: ServiceReponseMessage.SERVER_ERROR_MESSAGE
            }),
            {
                status: ServiceReponseCode.SERVER_ERROR_CODE,
                statusText: ServiceReponseMessage.SERVER_ERROR_MESSAGE,
                headers: ServiceResponseHeader.JSON()
            }
        );
    }

    public static unknownError(reason: string): Response {
        return new Response(
            JSON.stringify({
                status: ServiceReponseCode.SERVER_ERROR_CODE,
                message: reason
            }),
            {
                status: ServiceReponseCode.SERVER_ERROR_CODE,
                statusText: ServiceReponseMessage.SERVER_ERROR_MESSAGE,
                headers: ServiceResponseHeader.JSON()
            }
        );
    }
}
