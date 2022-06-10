import {
   AppContext, 
   AppSelectOption,
   TrelloWebhook,
} from '../types';
import { ConfigStoreProps, KVStoreClient, KVStoreOptions } from '../clients/kvstore';
import { ExceptionType, StoreKeys } from '../constant';
import { tryPromise } from '../utils/utils';
import { TrelloClient, TrelloOptions } from '../clients/trello';

export async function callSubscriptionList(context: AppContext): Promise<AppSelectOption[]> {
   const mattermostUrl: string | undefined = context.mattermost_site_url;
   const botAccessToken: string | undefined = context.bot_access_token;
   const user_id: string | undefined = context.acting_user?.id;

   const kvOptions: KVStoreOptions = {
      mattermostUrl: <string>mattermostUrl,
      accessToken: <string>botAccessToken
   };
   const kvStore: KVStoreClient = new KVStoreClient(kvOptions);
   const configStore: ConfigStoreProps = await kvStore.kvGet(StoreKeys.config);
   const user_oauth_token = await kvStore.getOauth2User(<string>user_id)

   const trelloOptions: TrelloOptions = {
      apiKey: configStore.trello_apikey,
      token: user_oauth_token.oauth_token, 
      workspace: configStore.trello_workspace
   }

   const trelloClient: TrelloClient = new TrelloClient(trelloOptions);
   const responseIntegration: TrelloWebhook[] = await tryPromise(trelloClient.getTrelloActiveWebhooks(), ExceptionType.MARKDOWN, 'Trello failed ');
   const options: AppSelectOption[] = responseIntegration.map((res: TrelloWebhook) => {
      return {
         label: res.description,
         value: res.id
      } as AppSelectOption;
   });
      
   return options;
}
