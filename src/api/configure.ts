import { 
   AppCallRequestWithValues, 
   AppCallResponse
} from '../types';
import { newConfigForm } from '../forms/trello_config';
import { 
   CallResponseHandler, 
   newErrorCallResponseWithMessage, 
   newFormCallResponse, 
   newOKCallResponseWithMarkdown, 
   showMessageToMattermost, 
   tryPromise
} from '../utils';
import { baseUrlFromContext } from '../utils';
import config from '../config';
import {TrelloClient, TrelloOptions} from '../clients/trello';
import {ConfigStoreProps, KVStoreClient, KVStoreOptions} from '../clients/kvstore';
import {ExceptionType, StoreKeys} from '../constant';

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
   const values = call.values as ConfigStoreProps;

   const options: KVStoreOptions = {
      mattermostUrl: <string>baseUrlFromContext(config.MATTERMOST.URL),
      accessToken: <string>call.context.bot_access_token,
   };
   
   const kvStoreClient = new KVStoreClient(options);

   const trelloOptions: TrelloOptions = {
      apiKey: values.trello_apikey,
      token: values.trello_oauth_access_token,
      workspace: values.trello_workspace
   }

   const trelloClient: TrelloClient = new TrelloClient(trelloOptions);

   let callResponse: AppCallResponse;
   
   try {
      await tryPromise(trelloClient.validateToken(trelloOptions.workspace), ExceptionType.TEXT_ERROR, 'Unable to submit configuration form: Trello failed ');

      await kvStoreClient.kvSet(StoreKeys.config, values);

      callResponse = newOKCallResponseWithMarkdown('Successfully updated Trello configuration');
      res.json(callResponse);
   } catch (error: any) {
      callResponse = showMessageToMattermost(error);
      res.json(callResponse);
   }
};
