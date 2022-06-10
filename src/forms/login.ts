import queryString from 'query-string';

import { AppCallRequest, AppCallValues, AppForm, ExpandedBotActingUser } from '../types';
import { Routes, TrelloIcon, AppFieldTypes, TRELLO_OAUTH, ExceptionType, StoreKeys } from '../constant';
import { ConfigStoreProps, KVStoreClient, KVStoreOptions } from '../clients/kvstore';
import { tryPromise } from '../utils';
import { TrelloClient } from '../clients/trello';
import { LoginForm } from '../constant/forms';
import config from '../config';
import { Exception } from '../utils/exception';

export async function getLoginForm(call: AppCallRequest): Promise<AppForm> {
   const context = call.context as ExpandedBotActingUser;
   const mattermostUrl: string | undefined =  context.mattermost_site_url;
   const botAccessToken: string | undefined = context.bot_access_token;

   const user_id = call.context.acting_user?.id;

   const kvOpts: KVStoreOptions = {
      mattermostUrl: <string>mattermostUrl,
      accessToken: <string>botAccessToken
   };
   const kvClient = new KVStoreClient(kvOpts);

   const user_oauth_token = await kvClient.getOauth2User(<string>user_id);

   const trelloConfig: ConfigStoreProps = await kvClient.kvGet(StoreKeys.config);
   if (!Object.keys(trelloConfig).length) {
      throw new Exception(ExceptionType.MARKDOWN, 'Initial configuration is not done.');
   }

   const queryParams: string = queryString.stringify({
      expiration: TRELLO_OAUTH.EXPIRATION.NEVER,
      name: TRELLO_OAUTH.APP_NAME,
      scope: `${TRELLO_OAUTH.SCOPE.READ},${TRELLO_OAUTH.SCOPE.WRITE}`,
      response_type: TRELLO_OAUTH.RESPONSE_TYPE.TOKEN,
      key: trelloConfig.trello_apikey
   });
   const url: string = `${config.TRELLO.URL}${Routes.TP.authorize}?${queryParams}`;
   const fields = [
      {
         type: AppFieldTypes.TEXT,
         name: LoginForm.TOKEN,
         modal_label: 'OAuth Token',
         value: user_oauth_token?.oauth_token ? user_oauth_token.oauth_token : '',
         hint: `token`,
         description: `To get your token [Follow this link](${url})`,
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
        }
      },
   } as AppForm;
}

export async function loginFormSaveToken(call: AppCallRequest) {
   const userId: string | undefined = call.context.acting_user?.id;
   const bot_token: string | undefined = call.context.bot_access_token;
   const mattermost_url: string | undefined = call.context.mattermost_site_url;
   const values: AppCallValues | undefined = call.values;

   const token: string = values?.[LoginForm.TOKEN];

   const kvOptions: KVStoreOptions = {
      accessToken: <string>bot_token,
      mattermostUrl: <string>mattermost_url
   }
    
   const kvClient = new KVStoreClient(kvOptions);
   const trelloConfig: ConfigStoreProps = await kvClient.kvGet(StoreKeys.config);
   if (!Object.keys(trelloConfig).length) {
      throw new Exception(ExceptionType.MARKDOWN, 'Initial configuration is not done.');
   }

   const trelloOptions = {
      apiKey: trelloConfig.trello_apikey,
      token: token,
      workspace: trelloConfig.trello_workspace
   }
   const trelloClient: TrelloClient = new TrelloClient(trelloOptions);
   await tryPromise(trelloClient.validateToken(trelloOptions.workspace), ExceptionType.TEXT_ERROR, 'Trello failed ');
   
   await kvClient.storeOauth2User(<string>userId, { oauth_token: token });
}

