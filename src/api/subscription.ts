import { Request, Response } from 'express';
import {
   errorDataMessage,
   newErrorCallResponseWithMessage,
   newOKCallResponseWithMarkdown,
   showMessageToMattermost,
   tryPromise
} from "../utils";
import {
   AppCallRequest,
   AppCallResponse,
   AppContext,
   AppSelectOption
} from "../types";
import {addSubscriptionCall} from '../forms/subscriptions';
import {ExceptionType, StoreKeys} from '../constant';
import {ConfigStoreProps, KVStoreClient, KVStoreOptions} from '../clients/kvstore';
import {TrelloClient, TrelloOptions} from '../clients/trello';
import {callSubscriptionList} from '../forms/subscription-list';
import {h6, joinLines} from '../utils/markdown';

export const addWebhookSubscription = async (request: Request, response: Response) => {
   const call: AppCallRequest = request.body;
   let callResponse: AppCallResponse;

   try {
      await addSubscriptionCall(call);
      callResponse = newOKCallResponseWithMarkdown("Subscription will be created");
      response.json(callResponse);
   } catch (error: any) {
      console.log('error', error);
      callResponse = showMessageToMattermost(error);
      response.json(callResponse);
   }
}

export const removeWebhookSubscription = async (req: Request, res: Response) => {
   const values = req.body.values;
   const subscription = values?.subscription as string;
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

   let callResponse: AppCallResponse;
   try {
      const trelloClient: TrelloClient = new TrelloClient(trelloOptions);
      await tryPromise(trelloClient.deleteTrelloWebhook(subscription), ExceptionType.MARKDOWN, 'Trello failed ');

      callResponse = newOKCallResponseWithMarkdown(`Subscription ID "${subscription}" removed sucessfully!`);
      res.json(callResponse);
   } catch (error: any) {
      callResponse = showMessageToMattermost(error);
      res.json(callResponse);
   }   
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
