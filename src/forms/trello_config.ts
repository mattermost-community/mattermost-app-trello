import { AppCallRequest, AppField, AppForm } from '../types';
import { AppFieldTypes } from 'mattermost-redux/constants/apps';
import Client4 from 'mattermost-redux/client/client4.js';

import { AppSelectOption, ExpandedBotActingUser, ExpandedOauth2App, Oauth2App } from '../types/apps';
import { Routes, TrelloIcon } from '../constant/index';
import config from '../config'
import { TrelloClient, TrelloOptions } from '../clients/trello';
import { ConfigStoreProps, KVStoreClient, KVStoreOptions } from '../clients/kvstore';

export async function newConfigForm(call: AppCallRequest): Promise<AppForm> {
   const context = call.context as ExpandedBotActingUser;
   const kvOpts: KVStoreOptions = {
      mattermostUrl: context.mattermost_site_url || '',
      accessToken: context.bot_access_token
   }
   
   const kvClient: KVStoreClient = new KVStoreClient(kvOpts);
   const trelloConfig: ConfigStoreProps = await kvClient.kvGet('config_trello_keys') as ConfigStoreProps;

   const fields = [
      {
         type: AppFieldTypes.TEXT,
         name: 'trello_webhook',
         label: 'URL',
         value: trelloConfig.trello_webhook,
         hint: 'Ex. https://yourhost.trello.com',
         description: 'Base URL of the Trello webhook configuration',
         is_required: true,
      },
      {
         type: AppFieldTypes.TEXT,
         name: 'trello_apikey',
         modal_label: 'API Key',
         value: trelloConfig.trello_apikey,
         description: 'Developer API Key obtained from Trello `https://trello.com/app-key`',
         is_required: true,
      },
      {
         type: AppFieldTypes.TEXT,
         subtype: 'password',
         name: 'trello_oauth_access_token',
         modal_label: 'API Token',
         value: trelloConfig.trello_oauth_access_token,
         description: 'Developer API Token obtained from Trello `https://trello.com/app-key`',
         is_required: true,
      }
   ];

   const form: AppForm = {
      title: 'Configure Trello',
      header: 'Configure the Trello app with the following information.',
      icon: TrelloIcon,
      fields,
      submit: {
         path: Routes.App.CallPathConfigSubmitOrUpdateForm,
      },
   };
   return form;
}

