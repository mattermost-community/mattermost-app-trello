import { AppCallRequest, AppField, AppForm } from '../types';
import { AppFieldTypes } from 'mattermost-redux/constants/apps';
import Client4 from 'mattermost-redux/client/client4.js';

import { ExpandedBotActingUser, ExpandedOauth2App, Oauth2App } from '../types/apps';
import { newMMClient } from '../clients';
import { MMClientOptions } from '../clients/mattermost';
import { BaseFormFields } from '../utils/base_form_fields';
import { ZendeskIcon } from '../utils/constants';
import { AppConfigStore, ConfigStore, newConfigStore } from '../store/config';
import { Routes, TrelloIcon } from '../constant/index';

// newZendeskConfigForm returns a form response to configure the zendesk client
export async function newZendeskConfigForm(call: AppCallRequest): Promise<AppForm> {
   const context = call.context as ExpandedBotActingUser;
   const mmOptions: MMClientOptions = {
      mattermostSiteURL: context.mattermost_site_url || '',
      actingUserAccessToken: context.acting_user_access_token,
      botAccessToken: context.bot_access_token,
   };
   const mmClient = newMMClient(mmOptions).asActingUser();
   const configStore = newConfigStore(context.bot_access_token, context.mattermost_site_url || '');
   const formFields = new FormFields(call, configStore, mmClient);
   const fields = await formFields.getConfigFields();

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

// FormFields retrieves viewable modal app fields
class FormFields extends BaseFormFields {
   configStore: ConfigStore
   storeValues: AppConfigStore
   OauthValues: Oauth2App

   constructor(call: AppCallRequest, configStore: ConfigStore, mmClient: Client4) {
      super(call, mmClient, undefined);
      const context = call.context as ExpandedOauth2App;
      this.configStore = configStore;
      this.OauthValues = {
         client_id: context.oauth2.client_id,
         client_secret: context.oauth2.client_secret,
      };
      this.storeValues = {
         trello_apikey: '',
         trello_oauth_access_token: '',
         trello_webhook: ''
      };
   }

   // getFields returns a list of viewable app fields mapped from Zendesk form fields
   async getConfigFields(): Promise<AppField[]> {
      await this.buildFields();
      return this.builder.getFields();
   }

   // buildFields adds fields to list of viewable proxy app fields
   async buildFields(): Promise<void> {
      this.storeValues = await this.configStore.getValues();
      this.addTrelloWeebhokField();
      this.addTrelloApiKeyField();
      this.addTrelloTokenField();
   }

   addTrelloWeebhokField(): void {
      const f: AppField = {
         type: AppFieldTypes.TEXT,
         name: 'trello_webhook',
         label: 'URL',
         value: this.storeValues.trello_webhook,
         hint: 'Ex. https://yourhost.trello.com',
         description: 'Base URL of the Trello webhook configuration',
         is_required: true,
      };
      this.builder.addField(f);
   }

   addTrelloApiKeyField(): void {
      const f: AppField = {
         type: AppFieldTypes.TEXT,
         name: 'trello_apikey',
         modal_label: 'API Key',
         value: this.storeValues.trello_apikey,
         description: 'Developer API Key obtained from Trello `https://trello.com/app-key`',
         is_required: true,
      };
      this.builder.addField(f);
   }
   addTrelloTokenField(): void {
      const f: AppField = {
         type: AppFieldTypes.TEXT,
         subtype: 'password',
         name: 'trello_oauth_access_token',
         modal_label: 'API Token',
         value: this.storeValues.trello_oauth_access_token,
         description: 'Developer API Token obtained from Trello `https://trello.com/app-key`',
         is_required: true,
      };
      this.builder.addField(f);
   }
}

