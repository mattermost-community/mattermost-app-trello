import { Request, Response } from 'express'
import { AppCallRequest, AppCallResponse } from "../types";
import { newFormCallResponse, newOKCallResponseWithMarkdown, showMessageToMattermost } from '../utils';
import { getConnectForm, connectFormSaveToken } from '../forms/connect';
import { KVStoreClient, KVStoreOptions, StoredOauthUserToken } from '../clients/kvstore';
import { Exception } from '../utils/exception';
import { ExceptionType } from '../constant';
import { configureI18n } from "../utils/translations";

export const getConnect = async (request: Request, response: Response) => {
  const call: AppCallRequest = request.body;

  let callResponse: AppCallResponse;

  try {
    const form = await getConnectForm(call);
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
	const i18nObj = configureI18n(call.context);

  try {
    await connectFormSaveToken(call);
    callResponse = newOKCallResponseWithMarkdown(i18nObj.__('api.connect.save'));
    return response.json(callResponse);
  } catch (error: any) {
    callResponse = showMessageToMattermost(error);
    return response.json(callResponse);
  }
}

export const getDisconnect = async (request: Request, response: Response) => {
  const call: AppCallRequest = request.body;
  const bot_token: string | undefined = call.context.bot_access_token;
  const mattermost_url: string | undefined = call.context.mattermost_site_url;
  const userId: string | undefined = call.context.acting_user?.id;
	const i18nObj = configureI18n(call.context);

  let callResponse: AppCallResponse;

  try {
    const kvOptions: KVStoreOptions = {
      accessToken: <string>bot_token,
      mattermostUrl: <string>mattermost_url
    }
    const kvClient: KVStoreClient = new KVStoreClient(kvOptions);

    const user_oauth_token: StoredOauthUserToken = await kvClient.getOauth2User(<string>userId);
    if (!Object.keys(user_oauth_token).length) {
      throw new Exception(ExceptionType.MARKDOWN, i18nObj.__('api.connect.disconnect_exception'));
    }
 
    await kvClient.kvDelete(<string>userId);
    callResponse = newOKCallResponseWithMarkdown(i18nObj.__('api.connect.disconnect_success'));
    response.json(callResponse);
  } catch(error: any) { 
    callResponse = showMessageToMattermost(error);
    response.json(callResponse);
  }
}




