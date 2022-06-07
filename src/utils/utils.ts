import { ConfigStoreProps, KVStoreClient } from "../clients/kvstore";
import { StoreKeys } from "../constant";
import { AppField } from "../types";

export function isFieldValueSelected(field: AppField): boolean {
    return Boolean(field.value);
}

export function baseUrlFromContext(mattermostSiteUrl: string): string {
    return mattermostSiteUrl || 'http://[::1]:8065';
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
        throw new Error('You are not logged in.')

    return user_oauth_token;
}

export async function tryGetTrelloConfig(kvClient: KVStoreClient) {
    const trelloConfig: ConfigStoreProps = await kvClient.kvGet(StoreKeys.config);
    if (JSON.stringify(trelloConfig) === '{}')
        throw new Error('Initial configuration is not done.')

    return trelloConfig;
}
