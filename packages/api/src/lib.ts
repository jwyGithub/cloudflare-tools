import type { IApiContent } from './types';

export const BASE_URL = 'https://api.cloudflare.com/client/v4';

export class CloudflareAPI {
    private static match_reg = /{{(.*?)}}/g;

    protected static format(url: string, values: IApiContent) {
        return url.replace(CloudflareAPI.match_reg, (_, key) => values[key] ?? `{{${key}}}`);
    }
}
