import { Request, Response } from 'express'
import { AppCallRequest, AppCallResponse } from "../types";
import { newErrorCallResponseWithMessage, newFormCallResponse, newOKCallResponseWithMarkdown } from '../utils';
import { getLoginForm } from '../forms/login';
import { KVStoreClient, KVStoreOptions } from '../clients/kvstore';

export const getLogin = async (request: Request, response: Response) => {
  const call: AppCallRequest = request.body;

  let callResponse: AppCallResponse;

  try {
    const form = await getLoginForm(call);
    callResponse = newFormCallResponse(form);
  } catch(error: any) { 
    callResponse = newErrorCallResponseWithMessage('Unable to create card form: ' + error.message);
  }
  return response.json(callResponse)
}

export const saveToken = async (request: Request, response: Response) => {
  const call: AppCallRequest = request.body;
  const token = call.values?.token;
  const userId = call.context.acting_user.id;
  const acting_user_token = call.state.user_token;
  const bot_token = call.context.bot_access_token;
  const mattermost_url = call.context.mattermost_site_url;

  try {
    const kvOptions: KVStoreOptions = {
      accessToken: bot_token ?? '',
      mattermostUrl: mattermost_url ?? ''
    }
    console.log(acting_user_token)
    console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
    const kvClient: KVStoreClient = new KVStoreClient(kvOptions);
    const kvResult = await kvClient.storeOauth2User(
      userId
      ,{
        oauth_token: token
      })
    
    console.log(kvResult)

  } catch (e) {
    //console.log(e)
  }
  return response.json(newOKCallResponseWithMarkdown('Auth Token stored.'))
}


