import { 
   AppCallRequestWithValues, 
   CtxExpandedBotActingUserAccessToken, 
   AppCallResponse 
} from '../types/apps';
import { newConfigForm } from '../forms';
import { 
   CallResponseHandler, 
   newErrorCallResponseWithFieldErrors, 
   newErrorCallResponseWithMessage, 
   newFormCallResponse, 
   newOKCallResponseWithMarkdown 
} from '../utils';
import { baseUrlFromContext } from '../utils/utils';
import config from '../config';
import fetch from "node-fetch";
import { Routes } from '../constant';
import { TrelloClient, TrelloOptions } from '../clients/trello';
import { ConfigStoreProps, KVStoreClient, KVStoreOptions } from '../clients/kvstore';

// openTrelloConfigForm opens a new configuration form
export const openTrelloConfigForm: CallResponseHandler = async (req, res) => {
   
   let callResponse: AppCallResponse;
   try {
      const form = await newConfigForm(req.body);
      callResponse = newFormCallResponse(form);
      res.json(callResponse);
   } catch (error: any) {
      callResponse = newErrorCallResponseWithMessage('Unable to open configuration form: ' + error.message);
      res.json(callResponse);
   }
};

export const submitTrelloConfig: CallResponseHandler = async (req, res) => {
   const call: AppCallRequestWithValues = req.body;
   const context = call.context as CtxExpandedBotActingUserAccessToken;
   const values = call.values as ConfigStoreProps;

   const options: KVStoreOptions = {
      mattermostUrl: <string>baseUrlFromContext(config.MATTERMOST.URL),
      accessToken: <string>call.context.bot_access_token,
   };
   const kvStoreClient = new KVStoreClient(options);

   const trelloOptions: TrelloOptions = {
      apiKey: values.trello_apikey,
      token: values.trello_oauth_access_token,
   }
   console.log(trelloOptions);

   let callResponse: AppCallResponse = newOKCallResponseWithMarkdown('Successfully updated Trello configuration');
   try {
      
      try {
         await verifyToken(trelloOptions);
      } catch (error: any) {
         callResponse = newErrorCallResponseWithFieldErrors({ trello_oauth_access_token: error.message });
         res.json(callResponse);
         return;
      }
      await kvStoreClient.kvSet('config_trello_keys', values);
   } catch (err: any) {
      callResponse = newErrorCallResponseWithMessage('Unable to submit configuration form: ' + err.message);
   }
   res.json(callResponse);
};

const verifyToken = async (trelloOpt: TrelloOptions) => {
   try {
      const trelloClient: TrelloClient = new TrelloClient(trelloOpt);
      const resultTrello = await trelloClient.validateToken(trelloOpt);
   } catch (err) {
      throw new Error(`${err}`);
   }
};