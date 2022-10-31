import { AppCallRequest, AppForm } from '../types';

import { ExpandedBotActingUser } from '../types';
import { Routes, TrelloIcon, AppFieldTypes, StoreKeys } from '../constant';
import { ConfigStoreProps, KVStoreClient, KVStoreOptions } from '../clients/kvstore';
import { ConfigureWorkspaceForm } from '../constant/forms';
import { configureI18n } from "../utils/translations";

export async function newConfigForm(call: AppCallRequest): Promise<AppForm> {
   const context = call.context as ExpandedBotActingUser;
	 const i18nObj = configureI18n(call.context);
   
   const kvOpts: KVStoreOptions = {
      mattermostUrl: context.mattermost_site_url || '',
      accessToken: context.bot_access_token
   };
   
   const kvClient: KVStoreClient = new KVStoreClient(kvOpts);
   const trelloConfig: ConfigStoreProps = await kvClient.kvGet(StoreKeys.config) as ConfigStoreProps;

   const fields = [
      {
         type: AppFieldTypes.TEXT,
         name: ConfigureWorkspaceForm.TRELLO_WORKSPACE,
         label: i18nObj.__('forms.config.workspace.label'),
         value: trelloConfig.trello_workspace,
         hint: i18nObj.__('forms.config.workspace.hint'),
         description: i18nObj.__('forms.config.workspace.description'),
         is_required: true,
      },
      {
         type: AppFieldTypes.TEXT,
         name: ConfigureWorkspaceForm.TRELLO_APIKEY,
         modal_label: i18nObj.__('forms.config.apikey.label'),
         value: trelloConfig.trello_apikey,
         description: i18nObj.__('forms.config.apikey.description'),
         is_required: true,
      },
      {
         type: AppFieldTypes.TEXT,
         subtype: 'password',
         name: ConfigureWorkspaceForm.TRELLO_TOKEN,
         modal_label: i18nObj.__('forms.config.token.label'),
         value: trelloConfig.trello_oauth_access_token,
         description: i18nObj.__('forms.config.token.description'),
         is_required: true,
      }
   ];

   return {
      title: i18nObj.__('forms.config.title'),
      header: i18nObj.__('forms.config.header'),
      icon: TrelloIcon,
      fields,
      submit: {
         path: Routes.App.CallPathConfigSubmitOrUpdateForm,
      },
   } as AppForm;
}

