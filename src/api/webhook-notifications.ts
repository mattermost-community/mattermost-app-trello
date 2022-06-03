import { Request, Response } from 'express';
import {
   CallResponseHandler,
   errorDataMessage,
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

export const createWebohookNotification = async (req: Request, res: Response) => {
   const call: TrelloWebhookResponse = req.body as TrelloWebhookResponse;
   const splitURL = req.url.split('/');
   const hookID = splitURL[splitURL.length - 1];
   const mattermostOptions: MattermostOptions = {
      accessToken: '',
      mattermostUrl: ''
   }
   let callResponse: AppCallResponse;

   try {
      const mattermostClient: MattermostClient = new MattermostClient(mattermostOptions);
      const hookMessage = trelloWebhookResponse(call);
      const postCreated = await mattermostClient.incomingWebhook(hookID, hookMessage);
      res.json(postCreated);
   } catch (error: any) {
      callResponse = newErrorCallResponseWithMessage(errorDataMessage(error.response));
      return res.json(callResponse);
   }
}
