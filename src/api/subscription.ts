import { Request, Response } from 'express';
import {
   CallResponseHandler,
   errorDataMessage,
   errorOpsgenieWithMessage,
   newErrorCallResponseWithMessage,
   newFormCallResponse,
   newOKCallResponseWithMarkdown
} from "../utils";
import { AppCallRequest, AppCallResponse, AppContext, AppSelectOption, CreateIncomingWebhook, IncomingWebhook } from "../types";
import { addSubscriptionCall, } from '../forms/subscriptions';
import { Routes, StoreKeys } from '../constant';
import { BoardSelected } from '../types/callResponses';
import { MattermostClient, MattermostOptions } from '../clients/mattermost'; 
import { getHTTPPath } from './manifest';
import { TrelloWebhook, TrelloWebhookResponse } from '../types/trello';
import { trelloWebhookResponse } from '../forms/trello-webhook';
import { TrelloImagePath } from '../constant/trello-webhook';
import { h5, h6, joinLines } from '../utils/markdown';
import { callSubscriptionList } from '../forms/subscription-list';
import { ConfigStoreProps, KVStoreClient, KVStoreOptions } from '../clients/kvstore';
import { TrelloClient, TrelloOptions } from '../clients/trello';

export const addWebhookSubscription = async (request: Request, response: Response) => {
   const call: AppCallRequest = request.body;
   let callResponse: AppCallResponse;

   try {
      await addSubscriptionCall(call);
      callResponse = newOKCallResponseWithMarkdown("Subscription will be created");
      response.json(callResponse);
   } catch (error: any) {
      console.log('error', error);
      callResponse = newErrorCallResponseWithMessage('Unexpected error: ' + error.message);
      response.json(callResponse);
   }
}

export const removeWebhookSubscription = async (req: Request, res: Response) => {
   const values = req.body.values;
   const subscription = values.subscription as AppSelectOption;
   const context = req.body.context as AppContext;
   const kvOpts: KVStoreOptions = {
      mattermostUrl: context.mattermost_site_url || '',
      accessToken: context.bot_access_token || ''
   };

   const kvClient: KVStoreClient = new KVStoreClient(kvOpts);
   const trelloConfig: ConfigStoreProps = await kvClient.kvGet(StoreKeys.config) as ConfigStoreProps;

   const trelloOptions: TrelloOptions = {
      apiKey: trelloConfig.trello_apikey,
      token: trelloConfig.trello_oauth_access_token,
      workspace: trelloConfig.trello_workspace
   };

   let callResponse: AppCallResponse = newOKCallResponseWithMarkdown(`Subscription "${subscription.label}" removed sucessfully!`);
   try {
      const trelloClient: TrelloClient = new TrelloClient(trelloOptions);
      await trelloClient.deleteTrelloWebhook(subscription.value);
   } catch (error: any) {
      callResponse = newErrorCallResponseWithMessage(errorOpsgenieWithMessage(error.response, 'Unable to remove subscription'));
   }
   
   res.json(callResponse);
}