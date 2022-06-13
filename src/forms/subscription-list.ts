import {
   AppContext, 
   TrelloWebhook,
} from '../types';
import { ConfigStoreProps, KVStoreClient, KVStoreOptions } from '../clients/kvstore';
import { ExceptionType, StoreKeys } from '../constant';
import { tryPromise } from '../utils/utils';
import { TrelloClient, TrelloOptions } from '../clients/trello';

export async function callSubscriptionList(context: AppContext): Promise<TrelloWebhook[]> {
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
      token: user_oauth_token.oauth_token
   }

   const trelloClient: TrelloClient = new TrelloClient(trelloOptions);
   const responseIntegration: TrelloWebhook[] = await tryPromise(trelloClient.getTrelloActiveWebhooks(), ExceptionType.MARKDOWN, 'Trello failed ');
 
   return responseIntegration;
}
