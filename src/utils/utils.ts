import {ConfigStoreProps, KVStoreClient, StoredOauthUserToken} from "../clients/kvstore";
import {StoreKeys} from "../constant";
import {Exception} from "./exception";
import {
    newErrorCallResponseWithMessage,
    newOKCallResponseWithMarkdown
} from "./call-responses";
import {ExceptionType} from "../constant";
import config from "../config";
import {AppActingUser, AppCallResponse} from "../types";

export function isUserSystemAdmin(actingUser: AppActingUser): boolean {
    return Boolean(actingUser.roles && actingUser.roles.includes('system_admin'));
}

export async function existsKvTrelloConfig(kvClient: KVStoreClient): Promise<boolean> {
    const trelloConfig: ConfigStoreProps = await kvClient.kvGet(StoreKeys.config);

    return Boolean(Object.keys(trelloConfig).length);
};

export async function existsKvOauthToken(kvClient: KVStoreClient): Promise<boolean> {
    const oauth2: StoredOauthUserToken = await kvClient.getOauth2User(StoreKeys.config);

    return Boolean(Object.keys(oauth2).length);
};

export function baseUrlFromContext(mattermostSiteUrl: string): string {
    return mattermostSiteUrl || config.MATTERMOST.URL;
}

export function replace(value: string, searchValue: string, replaceValue: string): string {
    return value.replace(searchValue, replaceValue);
}

export function errorDataMessage(error: Exception | Error | any): string {
    const errorMessage: string = error?.response?.data || error?.response?.data?.message || error?.message || error;
    return `${errorMessage}`;
}

export function tryPromise(p: Promise<any>, exceptionType: ExceptionType, message: string) {
    return p.catch((error) => {
        const errorMessage: string = errorDataMessage(error);
        throw new Exception(exceptionType, `${message} ${errorMessage}`);
    });
}

export function showMessageToMattermost(exception: Exception | Error): AppCallResponse {
    if (!(exception instanceof Exception)) {
        return newErrorCallResponseWithMessage(exception.message);
    }

    switch (exception.type) {
        case ExceptionType.TEXT_ERROR: return newErrorCallResponseWithMessage(exception.message);
        case ExceptionType.MARKDOWN: return newOKCallResponseWithMarkdown(exception.message);
        default: return newErrorCallResponseWithMessage(exception.message);
    }
}

export function getHTTPPath(): string {
    if (`${config.APP.HOST}`.includes('127.0.0.1') || `${config.APP.HOST}`.includes('localhost')) {
        return `${config.APP.HOST}:${Number(process.env.PORT) || config.APP.PORT}`;
    }

    return config.APP.HOST;
}
