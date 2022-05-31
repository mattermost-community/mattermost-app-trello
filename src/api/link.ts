import {Request, Response} from 'express';
import {newErrorCallResponseWithMessage, newFormCallResponse, newOKCallResponseWithMarkdown} from "../utils/call-responses";
import { AppCallRequest, AppCallResponse } from "../types";
import { KVStoreClient, ConfigStoreProps, KVStoreOptions } from '../clients/kvstore';
import config from '../config';
import { cardAddFromStepOne } from '../forms/card_add'

export const getLink = async (request: Request, response: Response) => {
  console.log(request)
  const call: AppCallRequest = request.body;
  const bot_token = call.context.bot_access_token?? '';
  let result = '';
  let callResponse: AppCallResponse;
  callResponse = newOKCallResponseWithMarkdown(result);

  try {
    const kvOptions: KVStoreOptions = {
      mattermostUrl: config.MATTERMOST.URL,
      accessToken: bot_token
    }

    const kvClient: KVStoreClient = new KVStoreClient(kvOptions);
    const props: ConfigStoreProps = {
      trello_apikey: config.TRELLO.API_KEY
    }
    /*const kvRes = await kvClient.kvSet('config', props);
    console.log('afterkv')
    console.log(kvRes);*/

    const kvRes2 = await kvClient.kvGet('config');
    console.log("KV GET")
    console.log(kvRes2);

    //result = await linkCommand(call, request.body, bot_token);
    //callResponse = newOKCallResponseWithMarkdown(result);
    const form = await cardAddFromStepOne(call);
    callResponse = newFormCallResponse(form);
    response.json(callResponse);
  } catch(error: any) { 
    callResponse = newErrorCallResponseWithMessage('Unable to link form: ' + error.message);
  }
  response.json(callResponse);
}

async function linkCommand(call: AppCallRequest, body: any, token: string) {
  console.log("LINK COMMAND")
  return 'linked to workspace';
}