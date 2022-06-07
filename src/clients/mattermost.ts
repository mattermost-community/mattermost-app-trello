import axios, {AxiosResponse} from 'axios';
import {
    MattermostPluginWebhook,
    PostCreate,
} from '../types';
import {AppsPluginName, Routes} from '../constant';
import config from '../config';

export interface MattermostOptions {
    mattermostUrl: string;
    accessToken: string | null | undefined;
}

export class MattermostClient {
    private readonly config: MattermostOptions;

    constructor(
        _config: MattermostOptions
    ) {
        if (config.MATTERMOST.USE) _config.mattermostUrl = config.MATTERMOST.URL;
        this.config = _config;
    }

    public createPost(post: PostCreate): Promise<any> {
        const url: string = `${this.config.mattermostUrl}${Routes.Mattermost.ApiVersionV4}${Routes.Mattermost.PostsPath}`;

        return axios.post(url, post, {
            headers: {
                Authorization: `Bearer ${this.config.accessToken}`
            }
        }).then((response: AxiosResponse<any>) => response.data);
    }

    public webhookPlugin(pluginData: MattermostPluginWebhook, data: any): Promise<string> {
        const url = `${pluginData.mattermostUrl}plugins/${AppsPluginName}/apps/${pluginData.appID}${pluginData.whPath}?secret=${pluginData.whSecret}`

        return axios.post(`${url}`, data)
            .then((response: AxiosResponse<any>) => response.data);
    }
}
