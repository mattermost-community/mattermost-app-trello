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
   const url = baseUrlFromContext(config.MATTERMOST.URL);
   const values = call.values as ConfigStoreProps;

   const options: KVStoreOptions = {
      mattermostUrl: <string>call.context.mattermost_site_url,
      accessToken: <string>call.context.bot_access_token,
   };
   const kvStoreClient = new KVStoreClient(options);

   const trelloOptions: TrelloOptions = {
      apiKey: values.trello_apikey,
      token: values.trello_oauth_access_token,
   }

   const trelloClient: TrelloClient = new TrelloClient(trelloOptions);

   let callResponse: AppCallResponse = newOKCallResponseWithMarkdown('Successfully updated Trello configuration');
   try {
      //const ppClient = newAppsClient(context.acting_user_access_token, url);
      //await ppClient.storeOauth2App(values.trello_apikey, values.trello_oauth_access_token);
      
      try {
         await verifyToken(url, values);
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

const verifyToken = async (url: string, data: ConfigStoreProps) => {
   const verifyURL = `${config.TRELLO.URL}${Routes.TP.getMembers}?key=${data.trello_apikey}&token=${data.trello_oauth_access_token}`;
   const quotedURL = '`token` and `key`';
   try {
      const resp = await fetch(verifyURL, { method: 'get' });
      if (!resp.ok) {
         throw new Error(`Failed to verify: ${quotedURL}`);
      }
   } catch (err) {
      throw new Error(`${err}`);
   }
};