import axios, {AxiosResponse} from 'axios';
import {tryPromiseWithMessage} from '../utils/utils';
import {AppsPluginName, Routes} from '../constant';

export interface KVStoreOptions {
    mattermostUrl: string;
    accessToken: string;
}

export interface ConfigStoreProps {
    trello_apikey: string;
}

export class KVStoreClient {
    private readonly config: KVStoreOptions;

    constructor(
        config: KVStoreOptions
    ) {
        this.config = config;
    }

    public kvSet(key: string, value: ConfigStoreProps): Promise<any> {
      console.log("KEY")
      console.log(key)
      console.log("VALUE")
      console.log(value)
      console.log(this.config.accessToken)
        const url = `${this.config.mattermostUrl}/plugins/${AppsPluginName}${Routes.Mattermost.ApiVersionV1}${Routes.Mattermost.PathKV}/${key}`;
        console.log(url)
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
}
