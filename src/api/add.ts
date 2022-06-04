import {Request, Response} from 'express';
import {
  newErrorCallResponseWithMessage,
  newFormCallResponse,
  newOKCallResponseWithMarkdown
} from "../utils";
import { AppCallRequest, AppCallResponse } from "../types";
import config from '../config';
import { TrelloClient, TrelloOptions } from '../clients/trello';
import { cardAddFromStepOne, cardAddFromStepTwo } from '../forms/card_add';
import { MattermostClient, MattermostOptions } from '../clients/mattermost';
import { ConfigStoreProps, KVStoreClient, KVStoreOptions } from '../clients/kvstore';
import { StoreKeys } from '../constant';

export const getAdd = async (request: Request, response: Response) => {
  const call: AppCallRequest = request.body;

  let callResponse: AppCallResponse;

  try {
    const form = await cardAddFromStepOne(call);
    callResponse = newFormCallResponse(form);
  } catch(error: any) {
    console.log('error', error);
    callResponse = newErrorCallResponseWithMessage('Unable to create card form: ' + error.message);
  }
  return response.json(callResponse)
}

export const formStepOne = async (request: Request, response: Response) => {
  const call: AppCallRequest = request.body;
  let callResponse: AppCallResponse;

  try {
    const form = await cardAddFromStepTwo(call);
    callResponse = newFormCallResponse(form);
  } catch(error: any) { 
    callResponse = newErrorCallResponseWithMessage('Unable to continue: ' + error.message);
  }
  return response.json(callResponse);

}

export const formStepTwo = async (request: Request, response: Response) => {
  const call: AppCallRequest = request.body;
  let callResponse: AppCallResponse;
  if (!call.values?.list_select) return response.json(newErrorCallResponseWithMessage('List or Board not provided'));
  const list_id = call.values?.list_select.value;
  const card_name = call.values?.card_name;
  const mattermostUrl = call.context.mattermost_site_url ?? '' ;
  const bot_token = call.context.bot_access_token;
  const user_id = call.context.acting_user?.id;

  const options: KVStoreOptions = {
    mattermostUrl: <string>mattermostUrl,
    accessToken: <string>call.context.bot_access_token,
  };
  
  const kvClient = new KVStoreClient(options);

  const trelloConfig: ConfigStoreProps = await kvClient.kvGet(StoreKeys.config);

  const user_oauth_token = await kvClient.getOauth2User(<string>user_id)

  const trelloOptions = {
    apiKey: trelloConfig.trello_apikey,
    token: user_oauth_token.oauth_token,
    workspace: trelloConfig.trello_workspace
  }

  const trelloClient: TrelloClient = new TrelloClient(trelloOptions);
  try {
    const resultTrello = await trelloClient.sendCreateCardRequest(list_id, card_name);
    callResponse = newOKCallResponseWithMarkdown('Card created')
  } catch(error: any) {
    console.log('error', error);
    callResponse = newErrorCallResponseWithMessage('Unable to continue: ' + error.message);
  }

  return response.json(callResponse);
}
