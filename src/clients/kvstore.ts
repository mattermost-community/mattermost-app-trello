import axios, {AxiosResponse} from 'axios';
import {tryPromiseWithMessage} from '../utils';
import {AppsPluginName, Routes} from '../constant';
import config from '../config';

export interface KVStoreOptions {
    mattermostUrl: string;
    accessToken: string;
}

export interface ConfigStoreProps {
    trello_apikey: string;
    trello_oauth_access_token: string;
    trello_webhook: string;
}

export interface StoredOauthUserToken {
    oauth_token: string;
}

export class KVStoreClient {
    private readonly config: KVStoreOptions;

    constructor(
        _config: KVStoreOptions
    ) {
        if (config.MATTERMOST.USE) _config.mattermostUrl = config.MATTERMOST.URL;
        this.config = _config;
    }

    public kvSet(key: string, value: ConfigStoreProps): Promise<any> {
        const url = `${this.config.mattermostUrl}/plugins/${AppsPluginName}${Routes.Mattermost.ApiVersionV1}${Routes.Mattermost.PathKV}/${key}`;
        const promise: Promise<any> = axios.post(url, value, {
            headers: {
                Authorization: `BEARER ${this.config.accessToken}`,
                'content-type': 'application/json; charset=UTF-8',
            },
        }).then((response: AxiosResponse<any>) => response.data);

        return tryPromiseWithMessage(promise, 'kvSet failed');
    }

    public kvGet(key: string): Promise<ConfigStoreProps> {
        const url = `${this.config.mattermostUrl}/plugins/${AppsPluginName}${Routes.Mattermost.ApiVersionV1}${Routes.Mattermost.PathKV}/${key}`;
        const promise: Promise<any> = axios.get(url, {
            headers: {
                Authorization: `BEARER ${this.config.accessToken}`,
                'content-type': 'application/json; charset=UTF-8',
            },
        }).then((response: AxiosResponse<any>) => response.data);

        return tryPromiseWithMessage(promise, 'kvSet failed');
    }

    public storeOauth2User(key: string, token: StoredOauthUserToken) {
        /*const url = `${this.config.mattermostUrl}/plugins/${AppsPluginName}${Routes.Mattermost.ApiVersionV1}/oauth2/user/trello`;
        const promise: Promise<any> = axios.post(url, token, {
            headers: {
                Authorization: `BEARER ${this.config.accessToken}`,
                'content-type': 'application/json; charset=UTF-8',
            },
        }).then((response: AxiosResponse<any>) => response.data);

        return tryPromiseWithMessage(promise, 'kvSet failed');*/
        const url = `${this.config.mattermostUrl}/plugins/${AppsPluginName}${Routes.Mattermost.ApiVersionV1}${Routes.Mattermost.PathKV}/${key}`;
        const promise: Promise<any> = axios.post(url, token, {
            headers: {
                Authorization: `BEARER ${this.config.accessToken}`,
                'content-type': 'application/json; charset=UTF-8',
            },
        }).then((response: AxiosResponse<any>) => response.data);

        return tryPromiseWithMessage(promise, 'kvSet failed');
    }
    
    public getOauth2User(key: string): Promise<StoredOauthUserToken> {
        const url = `${this.config.mattermostUrl}/plugins/${AppsPluginName}${Routes.Mattermost.ApiVersionV1}${Routes.Mattermost.PathKV}/${key}`;
        const promise: Promise<any> = axios.get(url, {
            headers: {
                Authorization: `BEARER ${this.config.accessToken}`,
                'content-type': 'application/json; charset=UTF-8',
            },
        }).then((response: AxiosResponse<any>) => response.data);

        return tryPromiseWithMessage(promise, 'kvSet failed');
    }
}
