import axios, {AxiosResponse} from 'axios';
import {
    CreateIncomingWebhook,
    DialogProps,
    IncomingWebhook,
    PostCreate,
    PostUpdate,
    User
} from '../types';
import {Routes} from '../constant';
import {replace} from "../utils";
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

    public updatePost(postId: string, post: PostUpdate): Promise<any> {
        const url: string = `${this.config.mattermostUrl}${Routes.Mattermost.ApiVersionV4}${Routes.Mattermost.PostPath}`;
        return axios.put(replace(url, Routes.PathsVariable.Identifier, postId), post, {
            headers: {
                Authorization: `Bearer ${this.config.accessToken}`
            }
        }).then((response: AxiosResponse<any>) => response.data);
    }

    public deletePost(postId: string): Promise<any> {
        const url: string = `${this.config.mattermostUrl}${Routes.Mattermost.ApiVersionV4}${Routes.Mattermost.PostPath}`;
        return axios.delete(replace(url, Routes.PathsVariable.Identifier, postId), {
            headers: {
                Authorization: `Bearer ${this.config.accessToken}`
            }
        }).then((response: AxiosResponse<any>) => response.data);
    }

    public getUser(userId: string): Promise<User> {
        const url: string = `${this.config.mattermostUrl}${Routes.Mattermost.ApiVersionV4}${Routes.Mattermost.UserPath}`;
        return axios.get(replace(url, Routes.PathsVariable.Identifier, userId), {
            headers: {
                Authorization: `Bearer ${this.config.accessToken}`
            }
        }).then((response: AxiosResponse<any>) => response.data);
    }

    public showDialog(dialog: DialogProps): Promise<any> {
        const url: string = `${this.config.mattermostUrl}${Routes.Mattermost.ApiVersionV4}${Routes.Mattermost.DialogsOpenPath}`;
        return axios.post(url, dialog, {
            headers: {
                Authorization: `Bearer ${this.config.accessToken}`
            }
        }).then((response: AxiosResponse<any>) => response.data);
    }

    public incomingWebhook(hookID: string, data: any): Promise<string> {
        return axios.post(`${this.config.mattermostUrl}${Routes.Mattermost.Hooks}/${hookID}`, data)
            .then((response: AxiosResponse<any>) => response.data);
    }
}
