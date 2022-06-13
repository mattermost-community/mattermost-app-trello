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

export const addWebhookSubscription = async (request: Request, response: Response) => {
   const call: AppCallRequest = request.body;
   let callResponse: AppCallResponse;

   try {
      await addSubscriptionCall(call);
      callResponse = newOKCallResponseWithMarkdown("Subscription will be created");
      response.json(callResponse);
   } catch (error: any) {
      callResponse = showMessageToMattermost(error);
      response.json(callResponse);
   }
}

export const removeWebhookSubscription = async (req: Request, res: Response) => {
   const call: AppCallRequest = req.body; 
   let callResponse: AppCallResponse;

   try {
      await removeWebhookCall(call);
      callResponse = newOKCallResponseWithMarkdown(`Subscription will be deleted`);
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
      const webhooks: TrelloWebhook[] = await callSubscriptionList(context);
      
      const subscriptionsText: string = [
         h6(`Subscription List: Found ${webhooks.length} open subscriptions.`),
         `${joinLines(
            webhooks.map((integration: TrelloWebhook) => {
               return `- Subscription ID: "${integration.id}" - ${integration.description}`;
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
