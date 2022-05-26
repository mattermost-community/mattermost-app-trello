import { 
   AppCallRequestWithValues, 
   CtxExpandedBotActingUserAccessToken, 
   AppCallResponse 
} from '../types/apps';
import { AppConfigStore, newConfigStore } from '../store/config';
import { newAppsClient } from '../clients';
import { newZendeskConfigForm } from '../forms';
import { 
   CallResponseHandler, 
   newErrorCallResponseWithFieldErrors, 
   newErrorCallResponseWithMessage, 
   newFormCallResponse, 
   newOKCallResponseWithMarkdown 
} from '../utils';
import { baseUrlFromContext } from '../utils/utils';
import { Routes } from '../utils/constants';
import config from '../config';
import fetch from "node-fetch";

// fOpenTrelloConfigForm opens a new configuration form
export const fOpenTrelloConfigForm: CallResponseHandler = async (req, res) => {
   let callResponse: AppCallResponse;
   try {
      const form = await newZendeskConfigForm(req.body);
      callResponse = newFormCallResponse(form);
      res.json(callResponse);
   } catch (error: any) {
      callResponse = newErrorCallResponseWithMessage('Unable to open configuration form: ' + error.message);
      res.json(callResponse);
   }
};

export const fSubmitOrUpdateZendeskConfigSubmit: CallResponseHandler = async (req, res) => {
   const call: AppCallRequestWithValues = req.body;
   const context = call.context as CtxExpandedBotActingUserAccessToken;
   const url = baseUrlFromContext(call.context.mattermost_site_url || '');
   const values = call.values as AppConfigStore;

   let callResponse: AppCallResponse = newOKCallResponseWithMarkdown('Successfully updated Trello configuration');
   try {
      const ppClient = newAppsClient(context.acting_user_access_token, url);
      await ppClient.storeOauth2App(values.trello_apikey, values.trello_oauth_access_token);
      const configStore = newConfigStore(context.bot_access_token, context.mattermost_site_url || '');
      const cValues = await configStore.getValues();
      
      // Using a simple /\/+$/ fails CodeQL check - Polynomial regular expression used on uncontrolled data.
      // The solution is to utilize the negative lookbehind pattern match.
      // Matches when the previous character is not a forward slash, then any number of slashes, and EOL.
      // https://codeql.github.com/codeql-query-help/javascript/js-polynomial-redos/#
      try {
         await verifyToken(url, values);
      } catch (error: any) {
         callResponse = newErrorCallResponseWithFieldErrors({ trello_oauth_access_token: error.message });
         res.json(callResponse);
         return;
      }
      await configStore.storeConfigInfo(values);
   } catch (err: any) {
      callResponse = newErrorCallResponseWithMessage('Unable to submit configuration form: ' + err.message);
   }
   res.json(callResponse);
};

const verifyToken = async (url: string, data: AppConfigStore) => {
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