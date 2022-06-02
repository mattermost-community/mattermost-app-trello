import { Request, Response } from 'express';
import {
   CallResponseHandler,
   errorDataMessage,
   errorOpsgenieWithMessage,
   errorWithMessage,
   newErrorCallResponseWithMessage,
   newFormCallResponse,
   newOKCallResponse,
   newOKCallResponseWithData,
   newOKCallResponseWithMarkdown
} from "../utils";
import { AppCallRequest, AppCallResponse, AppContext, CreateIncomingWebhook, IncomingWebhook } from "../types";
import { addSubscriptionForm, createWebhookForm } from '../forms/subscriptions';
import { Routes, StoreKeys } from '../constant';
import { BoardSelected } from '../types/callResponses';
import { MattermostClient, MattermostOptions } from '../clients/mattermost';
import { ConfigStoreProps, KVStoreClient, KVStoreOptions } from '../clients/kvstore';

export const addSubscription = async (request: Request, response: Response) => {
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
      const webhookURL = await getMattermostWebhook(mattermostClient, call.context)
      const form = await createWebhookForm(call, webhookURL);
      callResponse = newFormCallResponse(form);
      res.json(callResponse);
   } catch (error: any) {
      callResponse = newErrorCallResponseWithMessage(error.toString());
      return res.json(callResponse);
   }
}

const getMattermostWebhook = async (mattermostClient: MattermostClient, context: AppContext): Promise<string> => {
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
            username: "",
            icon_url: ""
         }
         const incomingWebhook: IncomingWebhook = await mattermostClient.createIncomingWebhook(newWebhook);
         hook_id = incomingWebhook.id;
      } else {
         hook_id = found.id;
      }

      return mattermostClient.returnHookURL(hook_id);
   } catch (error: any) {
      throw new Error(errorDataMessage(error.response));
   }
}

export const createWebohookNotification = async (request: Request, response: Response) => {
   const call: AppCallRequest = request.body;

   //console.log(call);
   response.json(call);
}


