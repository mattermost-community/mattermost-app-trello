import { Request, Response } from 'express';
import {
   CallResponseHandler,
   errorDataMessage,
   errorWithMessage,
   newErrorCallResponseWithMessage,
   newFormCallResponse,
   newOKCallResponseWithData,
   newOKCallResponseWithMarkdown
} from "../utils";
import { AppCallRequest, AppCallResponse, AppContext, AppSelectOption, CreateIncomingWebhook, IncomingWebhook } from "../types";
import { addSubscriptionCall, listWebhookCall, removeWebhookCall, } from '../forms/subscriptions';
import { Routes, StoreKeys } from '../constant';
import { ConfigStoreProps, KVStoreClient, KVStoreOptions } from '../clients/kvstore';
import { TrelloClient, TrelloOptions } from '../clients/trello';
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
      callResponse = newErrorCallResponseWithMessage(errorWithMessage(error.response, 'Unable to add subscription'));
      response.json(callResponse);
   }
}

export const removeWebhookSubscription = async (req: Request, res: Response) => {
   const call: AppCallRequest = req.body; 
   const subscription = call.values?.subscription as string;
   let callResponse: AppCallResponse;

   try {
      await removeWebhookCall(call);
      callResponse = newOKCallResponseWithMarkdown(`Subscription ID "${subscription}" removed sucessfully!`);
   } catch (error: any) {
      callResponse = newErrorCallResponseWithMessage(errorWithMessage(error.response, 'Unable to remove subscription'));
   }
   
   res.json(callResponse);
}


export const getWebhookSubscriptions = async (req: Request, res: Response) => {
   let callResponse: AppCallResponse;
   const context = req.body.context as AppContext;

   try {
      const subscriptionsText: string = await listWebhookCall(context);
      callResponse = newOKCallResponseWithMarkdown(subscriptionsText);
   } catch (error: any) {
      callResponse = newErrorCallResponseWithMessage(errorDataMessage(error));
   }
   res.json(callResponse);
}
