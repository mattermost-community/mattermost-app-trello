import { Request, Response } from 'express';
import {
   newOKCallResponseWithMarkdown,
   showMessageToMattermost,
} from "../utils";
import {
   AppCallRequest,
   AppCallResponse,
   AppContext,
   TrelloWebhook,
} from "../types";
import {addSubscriptionCall, removeWebhookCall} from '../forms/subscriptions';
import { callSubscriptionList } from '../forms/subscription-list';
import { h6, joinLines } from '../utils/markdown';
import { configureI18n } from "../utils/translations";

export const addWebhookSubscription = async (request: Request, response: Response) => {
   const call: AppCallRequest = request.body;
   let callResponse: AppCallResponse;
	 const i18nObj = configureI18n(call.context);

   try {
      await addSubscriptionCall(call);
      callResponse = newOKCallResponseWithMarkdown(i18nObj.__('api.subscription.response_add'));
      response.json(callResponse);
   } catch (error: any) {
      callResponse = showMessageToMattermost(error);
      response.json(callResponse);
   }
}

export const removeWebhookSubscription = async (req: Request, res: Response) => {
   const call: AppCallRequest = req.body; 
   let callResponse: AppCallResponse;
	 const i18nObj = configureI18n(call.context);

   try {
      await removeWebhookCall(call);
      callResponse = newOKCallResponseWithMarkdown(i18nObj.__('api.subscription.response_remove'));
      res.json(callResponse);
   } catch (error: any) {
      callResponse = showMessageToMattermost(error);
      res.json(callResponse);
   }   
}

export const getWebhookSubscriptions = async (req: Request, res: Response) => {
   let callResponse: AppCallResponse;
   const context = req.body.context as AppContext;
	 const i18nObj = configureI18n(context);

   try {
      const webhooks: TrelloWebhook[] = await callSubscriptionList(context);

      const subscriptionsText: string = [
         h6(i18nObj.__('api.subscription.response_get', { count: webhooks.length.toString() })),
         `${joinLines(
            webhooks.map((integration: TrelloWebhook) => {
               return i18nObj.__('api.subscription.response_subcription', { id: integration.id, description: integration.description })
            }).join('\n')
         )}`
      ].join('');
   
      callResponse = newOKCallResponseWithMarkdown(subscriptionsText);
      res.json(callResponse);
   } catch (error: any) {
      callResponse = showMessageToMattermost(error);
      res.json(callResponse);
   }
}
