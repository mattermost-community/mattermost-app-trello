import { Request, Response } from 'express'
import { AppCallRequest, AppCallResponse } from "../types";
import { newErrorCallResponseWithMessage, newFormCallResponse, newOKCallResponseWithMarkdown, showMessageToMattermost } from '../utils';
import { getLoginForm, loginFormSaveToken } from '../forms/login';
import { KVStoreClient, KVStoreOptions } from '../clients/kvstore';

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

  let callResponse: AppCallResponse;

  const userId = call.context.acting_user?.id;
  const bot_token = call.context.bot_access_token;
  const mattermost_url = call.context.mattermost_site_url;

  try {
    const kvOptions: KVStoreOptions = {
      accessToken: bot_token ?? '',
      mattermostUrl: mattermost_url ?? ''
    }
    const kvClient: KVStoreClient = new KVStoreClient(kvOptions);
    await kvClient.kvDelete(<string>userId);
    callResponse = newOKCallResponseWithMarkdown('Logged out successfully .')
  } catch(error: any) { 
    callResponse = newErrorCallResponseWithMessage('Unable to logout: ' + error.message);
  }
  return response.json(callResponse)
}




