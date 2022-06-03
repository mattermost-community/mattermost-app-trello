import { AppCallRequest, AppForm } from '../types';

import { ExpandedBotActingUser } from '../types';
import { Routes, TrelloIcon, AppFieldTypes, TRELLO_OAUTH, StoreKeys } from '../constant';
import { ConfigStoreProps, KVStoreClient, KVStoreOptions } from '../clients/kvstore';

export async function getLoginForm(call: AppCallRequest): Promise<AppForm> {
   const context = call.context as ExpandedBotActingUser;
   const kvOpts: KVStoreOptions = {
      mattermostUrl: context.mattermost_site_url || '',
      accessToken: context.bot_access_token
   };

   const kvClient = new KVStoreClient(kvOpts);

   const trelloConfig: ConfigStoreProps = await kvClient.kvGet(StoreKeys.config);

   const fields = [
      {
         type: AppFieldTypes.TEXT,
         name: 'token',
         modal_label: 'OAuth Token',
         value: '',
         hint: `token`,
         description: `[Follow the link](${TRELLO_OAUTH.BASE_URL}?expiration=${TRELLO_OAUTH.EXPIRATION.DAY}&name=${TRELLO_OAUTH.APP_NAME}&scope=${TRELLO_OAUTH.SCOPE.READ},${TRELLO_OAUTH.SCOPE.WRITE}&response_type=${TRELLO_OAUTH.RESPONSE_TYPE.TOKEN}&key=${trelloConfig.trello_apikey})`,
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

