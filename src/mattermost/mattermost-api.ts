import { AppPostMessage } from '../types';
import { httpModule } from '../http/http-module';
import {Routes} from '../constant';

export const mattermostApi = {
  postMessage: async (message: AppPostMessage, token: string, mattermost_url: string) => {
    console.log('POST MESSAGE')
    if (mattermost_url.includes('localhost')) mattermost_url = mattermost_url.replace('localhost', '[::1]');

    return await httpModule.post(`${mattermost_url}${Routes.Mattermost.ApiVersionV4}${Routes.Mattermost.PostsPath}`, message, token);
  },
  postToHook: async (message: any, hookToken: string, mattermost_url: string) => {
    if (mattermost_url.includes('localhost')) mattermost_url = mattermost_url.replace('localhost', '[::1]');

    console.log("post to hook")

    return await httpModule.post(`${mattermost_url}/hooks/${hookToken}`, message);
  }
}