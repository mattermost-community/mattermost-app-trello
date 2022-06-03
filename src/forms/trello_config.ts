import { AppCallRequest, AppForm } from '../types';

import { ExpandedBotActingUser } from '../types';
import { Routes, TrelloIcon, AppFieldTypes, StoreKeys } from '../constant';
import { ConfigStoreProps, KVStoreClient, KVStoreOptions } from '../clients/kvstore';

export async function newConfigForm(call: AppCallRequest): Promise<AppForm> {
   const context = call.context as ExpandedBotActingUser;
   const kvOpts: KVStoreOptions = {
      mattermostUrl: context.mattermost_site_url || '',
      accessToken: context.bot_access_token
   };
   
   const kvClient: KVStoreClient = new KVStoreClient(kvOpts);
   const trelloConfig: ConfigStoreProps = await kvClient.kvGet(StoreKeys.config) as ConfigStoreProps;

   const fields = [
      {
         type: AppFieldTypes.TEXT,
         name: 'trello_workspace',
         label: 'Workspace',
         value: trelloConfig.trello_workspace,
         hint: 'Ex. https://trello.com/yourWorkspace',
         description: 'Trello workspace, in `Ex. https://trello.com/yourWorkspace`, the workspace would be `yourWorkspace`',
         is_required: true,
      },
      {
         type: AppFieldTypes.TEXT,
         name: 'trello_apikey',
         modal_label: 'API Key',
         value: trelloConfig.trello_apikey,
         description: 'Developer API Key obtained from Trello https://trello.com/app-key',
         is_required: true,
      },
      {
         type: AppFieldTypes.TEXT,
         subtype: 'password',
         name: 'trello_oauth_access_token',
         modal_label: 'API Token',
         value: trelloConfig.trello_oauth_access_token,
         description: 'Developer API Token obtained from Trello https://trello.com/app-key',
         is_required: true,
      }
   ];

   return {
      title: 'Configure Trello',
      header: 'Configure the Trello app with the following information.',
      icon: TrelloIcon,
      fields,
      submit: {
         path: Routes.App.CallPathConfigSubmitOrUpdateForm,
      },
   } as AppForm;
}

