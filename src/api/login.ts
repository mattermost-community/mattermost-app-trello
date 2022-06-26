import { Request, Response } from 'express'
import { AppCallRequest, AppCallResponse } from "../types";
import { newFormCallResponse, newOKCallResponseWithMarkdown, showMessageToMattermost } from '../utils';
import { getLoginForm, loginFormSaveToken } from '../forms/login';
import { KVStoreClient, KVStoreOptions, StoredOauthUserToken } from '../clients/kvstore';
import { Exception } from '../utils/exception';
import { ExceptionType } from '../constant';

export const getLogin = async (request: Request, response: Response) => {
  const call: AppCallRequest = request.body;

  let callResponse: AppCallResponse;

  try {
    const form = await getLoginForm(call);
    callResponse = newFormCallResponse(form);
    return response.json(callResponse);
  } catch(error: any) {
    callResponse = showMessageToMattermost(error);
    return response.json(callResponse);
  }
}

export const saveToken = async (request: Request, response: Response) => {
  const call: AppCallRequest = request.body;
  let callResponse: AppCallResponse;

  try {
    await loginFormSaveToken(call);
    callResponse = newOKCallResponseWithMarkdown('Auth Token stored.');
    return response.json(callResponse);
  } catch (error: any) {
    callResponse = showMessageToMattermost(error);
    return response.json(callResponse);
  }
}

export const getLogout = async (request: Request, response: Response) => {
  const call: AppCallRequest = request.body;
  const bot_token: string | undefined = call.context.bot_access_token;
  const mattermost_url: string | undefined = call.context.mattermost_site_url;
  const userId: string | undefined = call.context.acting_user?.id;


  let callResponse: AppCallResponse;

  try {
    const kvOptions: KVStoreOptions = {
      accessToken: <string>bot_token,
      mattermostUrl: <string>mattermost_url
    }
    const kvClient: KVStoreClient = new KVStoreClient(kvOptions);

    const user_oauth_token: StoredOauthUserToken = await kvClient.getOauth2User(<string>userId);
    if (!Object.keys(user_oauth_token).length) {
      throw new Exception(ExceptionType.MARKDOWN, 'You are not logged in.');
    }
 

    await kvClient.kvDelete(<string>userId);
    callResponse = newOKCallResponseWithMarkdown('Logged out successfully.');
    response.json(callResponse);
  } catch(error: any) { 
    callResponse = showMessageToMattermost(error);
    response.json(callResponse);
  }
}




