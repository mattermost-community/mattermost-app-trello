import axios, { AxiosResponse } from 'axios';
import queryString from 'query-string';

import {
    Manifest,
    PostCreate,
} from '../types';
import { AppsPluginName, Routes } from '../constant';
import { replace, routesJoin } from '../utils';
import manifest from '../manifest.json';

export interface MattermostOptions {
    mattermostUrl: string;
    accessToken: string | null | undefined;
}

export class MattermostClient {
    private readonly config: MattermostOptions;

    constructor(
        _config: MattermostOptions
    ) {
        this.config = _config;
    }

    public updateRolesByUser(userId: string, roles: string): Promise<any> {
        const url = routesJoin([this.config.mattermostUrl, Routes.Mattermost.ApiVersionV4, Routes.Mattermost.UsersUpdateRolePath]);
        return axios.put(replace(url, Routes.PathsVariable.Identifier, userId), { roles }, {
            headers: {
                Authorization: `Bearer ${this.config.accessToken}`,
            },
        }).then((response: AxiosResponse<any>) => response.data);
    }

    public createPost(post: PostCreate): Promise<any> {
        const url = routesJoin([this.config.mattermostUrl, Routes.Mattermost.ApiVersionV4, Routes.Mattermost.PostsPath]);
        return axios.post(url, post, {
            headers: {
                Authorization: `Bearer ${this.config.accessToken}`,
            },
        }).then((response: AxiosResponse<any>) => response.data);
    }

    public addUserToTeam(teamId: string, userId: string): Promise<any> {
        const url = routesJoin([this.config.mattermostUrl, Routes.Mattermost.ApiVersionV4, Routes.Mattermost.TeamMemberPath]);
        const body = {
            team_id: teamId,
            user_id: userId,
        };
        return axios.post(replace(url, Routes.PathsVariable.Identifier, teamId), body, {
            headers: {
                Authorization: `Bearer ${this.config.accessToken}`,
            },
        }).then((response: AxiosResponse<any>) => response.data);
    }

    public addUserToChannel(channelId: string, userId: string): Promise<any> {
        const url = routesJoin([this.config.mattermostUrl, Routes.Mattermost.ApiVersionV4, Routes.Mattermost.ChannelMemberPath]);
        const body = {
            user_id: userId,
        };
        return axios.post(replace(url, Routes.PathsVariable.Identifier, channelId), body, {
            headers: {
                Authorization: `Bearer ${this.config.accessToken}`,
            },
        }).then((response: AxiosResponse<any>) => response.data);
    }
}
