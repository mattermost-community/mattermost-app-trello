import fetch from 'node-fetch';
import config from '../config';
import { AppPostMessage } from '../types';
import { httpModule } from '../http/http-module';

export const mattermostApi = {
  postMessage: async (message: AppPostMessage, token: string) => {
    return await httpModule.post(`${config.MATTERMOST.URL}posts`, message, token);
  }
}