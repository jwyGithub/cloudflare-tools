export interface IApiContent {
    account_id?: string;

    namespace_id?: string;

    value?: string;

    key_name?: string;
}

export type ApiMap = [string, (args?: IApiContent) => string];
