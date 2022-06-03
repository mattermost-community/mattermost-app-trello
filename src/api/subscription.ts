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
import { addSubscriptionForm, createWebhookForm } from '../forms/subscriptions';
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
      const form = await addSubscriptionForm(call);
      callResponse = newFormCallResponse(form);
      response.json(callResponse);
   } catch (error: any) {
      callResponse = newErrorCallResponseWithMessage('Unable to create card form: ' + error.message);
      response.json(callResponse);
   }
}

export const createTrelloWebhookSubmit: CallResponseHandler = async (req, res) => {
   const call: AppCallRequest = req.body;

   let callResponse: AppCallResponse;
   const board = (call.values as BoardSelected).board;
   const mattermostOptions: MattermostOptions = {
      accessToken: call.context.acting_user_access_token || '',
      mattermostUrl: call.context.mattermost_site_url || ''
   }

   const mattermostClient: MattermostClient = new MattermostClient(mattermostOptions);

   try {
      const hookID = await getMattermostHookID(mattermostClient, call.context)
      const webhookURL = createHookURL(hookID);
      const form = await createWebhookForm(call, webhookURL);
      callResponse = newFormCallResponse(form);
      res.json(callResponse);
   } catch (error: any) {
      callResponse = newErrorCallResponseWithMessage(error.toString());
      return res.json(callResponse);
   }
}

const getMattermostHookID = async (mattermostClient: MattermostClient, context: AppContext): Promise<string> => {
   const channel_id = context.channel.id;
   let hook_id: string = '';
   try {
      const params = {
         f: context.channel.team_id
      }
      const listWebhooks = await mattermostClient.getIncomingWebhooks(params);
      const found = listWebhooks.find(hook => hook.channel_id === channel_id);
      
      if (!found) {
         const newWebhook: CreateIncomingWebhook = {
            channel_id: context.channel.id,
            display_name: 'Trello Webhook',
            description: `Added webhook to get notifications from Trello boards`,
            channel_locked: true,
            username: "Trello Webhook",
            icon_url: TrelloImagePath(context.mattermost_site_url || '')
         }
         const incomingWebhook: IncomingWebhook = await mattermostClient.createIncomingWebhook(newWebhook);
         hook_id = incomingWebhook.id;
      } else {
         hook_id = found.id;
      }

      return hook_id;
   } catch (error: any) {
      throw new Error(errorDataMessage(error.response));
   }
}

const createHookURL = (hookID: string): string => {
   return `${ getHTTPPath() }${ Routes.App.CallReceiveNotification }/${hookID}`;
}

export const getWebhookSubscriptions = async (req: Request, res: Response) => {
   let callResponse: AppCallResponse;
   const context = req.body.context as AppContext;
   
   try {
      const integrations: AppSelectOption[] = await callSubscriptionList(context);
        const subscriptionsText: string = [
            h6(`Subscription List: Found ${integrations.length} open subscriptions.`),
            `${joinLines(
               integrations.map((integration: AppSelectOption) => {
                  return `- Subscription ID: "${integration.value}" - Description "${integration.label}"`;
                }).join('\n')
            )}`
        ].join('');

      callResponse = newOKCallResponseWithMarkdown(subscriptionsText);
   } catch (error: any) {
      callResponse = newErrorCallResponseWithMessage(errorDataMessage(error));
   }
   res.json(callResponse);
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