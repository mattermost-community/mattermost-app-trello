import {ConfigStoreProps, KVStoreClient} from "../clients/kvstore";
import {StoreKeys} from "../constant";
import {Exception} from "./exception";
import {
    newErrorCallResponseWithMessage,
    newOKCallResponse,
    newOKCallResponseWithMarkdown
} from "./call-responses";
import {ExceptionLevel} from "../constant/exception-level";
import config from "../config";
import {UserProfile} from "../types";

export function isUserSystemAdmin(actingUser: UserProfile): boolean {
    return Boolean(actingUser.roles && actingUser.roles.includes('system-admin'));
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
    if (JSON.stringify(user_oauth_token) === '{}')
        throw new Exception(ExceptionLevel.WARNING, 'You are not logged in.')

    return user_oauth_token;
}

export async function tryGetTrelloConfig(kvClient: KVStoreClient) {
    const trelloConfig: ConfigStoreProps = await kvClient.kvGet(StoreKeys.config);
    if (JSON.stringify(trelloConfig) === '{}')
        throw new Exception(ExceptionLevel.WARNING, 'Initial configuration is not done.')

    return trelloConfig;
}

export function tryPromise(p: Promise<any>, level: ExceptionLevel, message: string) {
    return p.catch((error) => {
        throw new Exception(level, message);
    });
}

export function showMessageByException(exception: Exception, message: string) {
    switch (exception.level) {
        case ExceptionLevel.ERROR: newOKCallResponse(); break;
        case ExceptionLevel.WARNING: newOKCallResponseWithMarkdown(message); break;
        default: newErrorCallResponseWithMessage(message); break;
    }
}
