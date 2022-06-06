import { AppCallRequest, AppForm } from '../types';

import { ExpandedBotActingUser } from '../types';
import { Routes, TrelloIcon, AppFieldTypes, TRELLO_OAUTH } from '../constant';
import { ConfigStoreProps, KVStoreClient, KVStoreOptions } from '../clients/kvstore';
import { tryGetTrelloConfig, tryPromiseWithMessage } from '../utils';
import { TrelloClient } from '../clients/trello';
import { LoginForm } from '../constant/forms';

export async function getLoginForm(call: AppCallRequest): Promise<AppForm> {
   const context = call.context as ExpandedBotActingUser;
   const kvOpts: KVStoreOptions = {
      mattermostUrl: context.mattermost_site_url || '',
      accessToken: context.bot_access_token
   };

   const kvClient = new KVStoreClient(kvOpts);

   const trelloConfig: ConfigStoreProps = await tryGetTrelloConfig(kvClient);

   const fields = [
      {
         type: AppFieldTypes.TEXT,
         name: LoginForm.TOKEN,
         modal_label: 'OAuth Token',
         value: '',
         hint: `token`,
         description: `To get your token [Follow this link](${TRELLO_OAUTH.BASE_URL}?expiration=${TRELLO_OAUTH.EXPIRATION.DAY}&name=${TRELLO_OAUTH.APP_NAME}&scope=${TRELLO_OAUTH.SCOPE.READ},${TRELLO_OAUTH.SCOPE.WRITE}&response_type=${TRELLO_OAUTH.RESPONSE_TYPE.TOKEN}&key=${trelloConfig.trello_apikey})`,
         is_required: true,
      }
   ];

   return {
      title: 'Authorize Trello',
      header: 'Provide your Trello OAuth Token.',
      icon: TrelloIcon,
      fields,
      submit: {
         path: `${Routes.App.BindingPathLogin}${Routes.App.Submit}`,
         expand: {
          acting_user: 'summary',
          acting_user_access_token: 'summary'
        },
        state: {
          user_token: context.acting_user_access_token
        }
      },
   } as AppForm;
}

export async function loginFormSaveToken(call: AppCallRequest) {
   const token = call.values?.[LoginForm.TOKEN];
   const userId = call.context.acting_user?.id;
   const bot_token = call.context.bot_access_token;
   const mattermost_url = call.context.mattermost_site_url;

   const kvOptions: KVStoreOptions = {
      accessToken: bot_token ?? '',
      mattermostUrl: mattermost_url ?? ''
   }
    
   const kvClient = new KVStoreClient(kvOptions);
   const trelloConfig: ConfigStoreProps = await tryGetTrelloConfig(kvClient);
  
   const trelloOptions = {
      apiKey: trelloConfig.trello_apikey,
      token: token,
      workspace: trelloConfig.trello_workspace
   }

   const trelloClient: TrelloClient = new TrelloClient(trelloOptions);
   await tryPromiseWithMessage(trelloClient.validateToken(), 'Invalid token.');
   
   await kvClient.storeOauth2User(
   userId ?? ''
   ,{
      oauth_token: token
   })
}

