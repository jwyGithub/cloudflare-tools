export interface SendMessageString {
    token?: string;
    chatId?: string;
    message?: string;
}

export interface SendMessageArray {
    token?: string;
    chatId?: string;
    message?: string[];
}

export async function notifyTelegram({ token, chatId, message }: SendMessageString): Promise<Response>;
export async function notifyTelegram({ token, chatId, message }: SendMessageArray): Promise<Response>;

/**
 * @description Send message to telegram
 * @param {SendMessageString | SendMessageArray} options
 * @returns  {Promise<Response>} Response
 */
export async function notifyTelegram(options: SendMessageString | SendMessageArray): Promise<Response> {
    const { token, chatId, message } = options;
    if (!token || !chatId) return new Response('Missing token or chatId', { status: 400 });

    const _message = Array.isArray(message) ? message : [message];
    const searchParams = new URLSearchParams();
    searchParams.set('chat_id', chatId);
    searchParams.set('parse_mode', 'HTML');
    searchParams.set('text', _message.join('\n'));

    try {
        const url = `https://api.telegram.org/bot${token}/sendMessage?${searchParams.toString()}`;
        return await fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'text/html,application/xhtml+xml,application/xml;',
                'Accept-Encoding': 'gzip, deflate, br',
                'User-Agent': 'Mozilla/5.0 Chrome/90.0.4430.72'
            }
        });
    } catch {
        return Response.error();
    }
}
