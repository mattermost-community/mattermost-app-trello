import { Request, Response } from 'express';
import {
   CallResponseHandler,
   newErrorCallResponseWithMessage,
   newFormCallResponse,
   newOKCallResponse,
   newOKCallResponseWithData,
   newOKCallResponseWithMarkdown
} from "../utils";
import { AppCallRequest, AppCallResponse } from "../types";
import { addSubscriptionForm, createWebhookForm } from '../forms/subscriptions';
import { Routes } from '../constant';
import { BoardSelected } from '../types/callResponses';

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

   try {
      const form = await createWebhookForm(call);
      console.log(form);
      callResponse = newFormCallResponse(form);
      res.json(callResponse);
   } catch (error: any) {
      callResponse = newErrorCallResponseWithMessage(error.toString());
      res.json(callResponse)
   }
}

export const createWebohookNotification = async (request: Request, response: Response) => {
   const call: AppCallRequest = request.body;

   console.log(call);
   response.json(call);
}

function subscriptionCreatedTitle() {
   throw new Error('Function not implemented.');
}
