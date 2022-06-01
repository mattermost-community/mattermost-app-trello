import {Request, Response} from 'express';
import {newErrorCallResponseWithMessage, newFormCallResponse, newOKCallResponseWithMarkdown} from "../utils/call-responses";
import { AppCallRequest, AppCallResponse } from "../types";
import { mattermostApi } from '../mattermost/mattermost-api';
import config from '../config';
import { TrelloClient, TrelloOptions } from '../clients/trello';
import { cardAddFromStepOne, cardAddFromStepTwo } from '../forms/card_add';
import { MattermostClient, MattermostOptions } from '../clients/mattermost2';
import { Routes } from '../constant';

export const getAdd = async (request: Request, response: Response) => {
  const call: AppCallRequest = request.body;
  const bot_token = call.context.bot_access_token?? '';
  let result = 'result test';
  let callResponse: AppCallResponse;
  callResponse = newOKCallResponseWithMarkdown(result);

  try {
    const form = await cardAddFromStepOne(call);
    callResponse = newFormCallResponse(form);
    callResponse.call = { path: `${Routes.App.Forms}${Routes.App.BindingPathCreateCard}` }
  } catch(error: any) { 
    callResponse = newErrorCallResponseWithMessage('Unable to create card form: ' + error.message);
  }
  response.json(callResponse);
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
  response.json(callResponse); 
}

export const formStepTwo = async (request: Request, response: Response) => {
  const call: AppCallRequest = request.body;
  let callResponse: AppCallResponse;
  const list_id = call.values?.list_select.value;
  const card_name = call.values?.card_name;
  const mattermostUrl = call.context.mattermost_site_url ?? '' ;
  const bot_token = call.context.bot_access_token;

  const trelloOptions: TrelloOptions = {
    apiKey: config.TRELLO.API_KEY,
    token: config.TRELLO.TOKEN,
  }

  const trelloClient: TrelloClient = new TrelloClient(trelloOptions);
  try {
    const resultTrello = await trelloClient.sendCreateCardRequest(list_id, card_name);
    const hookMessage = {
      text: 'New card created from Hook',
      attachments: [
        {
            author_icon: 'https://trello-members.s3.amazonaws.com/627ad9bcc8aeeb621b7dfd71/cd2acddb9dcc091de7f73b9200f4c4cf/30.png',
            author_name: 'jose lopez',
            author_link: 'https://trello.com/joselopez864',
            title: resultTrello.name,
            title_link: resultTrello.url,
            text: `Card ${card_name} added to board`,
        }]
    }

    const mattermostOptions: MattermostOptions = {
      accessToken: bot_token,
      mattermostUrl: mattermostUrl
    }
    
    const mattermostClient: MattermostClient = new MattermostClient(mattermostOptions);
    await mattermostClient.incomingWebhook(hookMessage);
    callResponse = newOKCallResponseWithMarkdown('')
  } catch(error: any) {
    callResponse = newErrorCallResponseWithMessage('Unable to continue: ' + error.message);
  }

  return response.json(callResponse);
}
