import { 
   AppCallRequestWithValues, 
   AppCallResponse
} from '../types';
import { newConfigForm } from '../forms/trello_config';
import { 
   CallResponseHandler, 
   errorDataMessage, 
   errorWithMessage, 
   newErrorCallResponseWithFieldErrors, 
   newErrorCallResponseWithMessage, 
   newFormCallResponse, 
   newOKCallResponseWithMarkdown 
} from '../utils';
import { baseUrlFromContext } from '../utils';
import config from '../config';
import {TrelloClient, TrelloOptions} from '../clients/trello';
import {ConfigStoreProps, KVStoreClient, KVStoreOptions} from '../clients/kvstore';
import {StoreKeys} from '../constant';
import { ConfigureWorkspaceForm } from '../constant/forms';

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

   let callResponse: AppCallResponse = newOKCallResponseWithMarkdown('Successfully updated Trello configuration');
   
   try {
      await verifyToken(trelloOptions);
      await kvStoreClient.kvSet(StoreKeys.config, values);
   } catch (err: any) {
      callResponse = newErrorCallResponseWithMessage(errorWithMessage(err.message, 'Unable to submit configuration form'));
   }

   res.json(callResponse);
};

const verifyToken = async (trelloOpt: TrelloOptions) => {
   try {
      const trelloClient: TrelloClient = new TrelloClient(trelloOpt);
      await trelloClient.validateToken(trelloOpt.workspace);
   } catch (err: any) {
      throw new Error(`${errorDataMessage(err.response)}`);
   }
};