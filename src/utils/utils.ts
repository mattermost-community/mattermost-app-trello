import {ConfigStoreProps, KVStoreClient} from "../clients/kvstore";
import {StoreKeys} from "../constant";
import {Exception} from "./exception";
import {
    newErrorCallResponseWithMessage,
    newOKCallResponseWithMarkdown
} from "./call-responses";
import {ExceptionType} from "../constant";
import config from "../config";
import {AppCallResponse, UserProfile} from "../types";

export function isUserSystemAdmin(actingUser: UserProfile): boolean {
    return Boolean(actingUser.roles && actingUser.roles.includes('system_admin'));
}

export function baseUrlFromContext(mattermostSiteUrl: string): string {
    return mattermostSiteUrl || config.MATTERMOST.URL;
}

export function replace(value: string, searchValue: string, replaceValue: string): string {
    return value.replace(searchValue, replaceValue);
}

export function errorDataMessage(error: Error | any): string {
    const errorMessage: string = error?.data?.message || error?.message || error?.data || error;
    return `${errorMessage}`;
}

export function errorWithMessage(error: Error | any, message: string): string {
    return `"${message}".  ${errorDataMessage(error)}`;
}

export async function tryPromiseWithMessage(p: Promise<any>, message: string): Promise<any> {
    return p.catch((error) => {
        throw new Error(errorWithMessage(error, message));
    });
}

export async function tryPromiseOpsgenieWithMessage(p: Promise<any>, message: string): Promise<any> {
    return p.catch((error) => {
        throw new Error(errorWithMessage(error.response, message));
    });
}

export async function tryGetUserOauthToken(kvClient: KVStoreClient, key: string) {
    const user_oauth_token = await kvClient.getOauth2User(key);
    if (!Object.keys(user_oauth_token).length)
        throw new Exception(ExceptionType.MARKDOWN, 'You are not logged in.')

    return user_oauth_token;
}

export async function tryGetTrelloConfig(kvClient: KVStoreClient) {
    const trelloConfig: ConfigStoreProps = await kvClient.kvGet(StoreKeys.config);
    if (!Object.keys(trelloConfig).length)
        throw new Exception(ExceptionType.MARKDOWN, 'Initial configuration is not done.')

    return trelloConfig;
}

export function tryPromise(p: Promise<any>, exceptionType: ExceptionType, message: string) {
    return p.catch((error) => {
        throw new Exception(exceptionType, message);
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
        return config.APP.HOST;
    }

    return `${config.APP.HOST}:${Number(process.env.PORT) || config.APP.PORT}`;
}
