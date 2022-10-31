import {
   AppContext, 
   TrelloWebhook,
} from '../types';
import { ConfigStoreProps, KVStoreClient, KVStoreOptions, StoredOauthUserToken } from '../clients/kvstore';
import { ExceptionType, StoreKeys } from '../constant';
import { tryPromise } from '../utils/utils';
import { TrelloClient, TrelloOptions } from '../clients/trello';
import { Exception } from '../utils/exception';
import { configureI18n } from "../utils/translations";

export async function callSubscriptionList(context: AppContext): Promise<TrelloWebhook[]> {
   const mattermostUrl: string | undefined = context.mattermost_site_url;
   const botAccessToken: string | undefined = context.bot_access_token;
   const user_id: string | undefined = context.acting_user?.id;
	 const i18nObj = configureI18n(context);

   const kvOptions: KVStoreOptions = {
      mattermostUrl: <string>mattermostUrl,
      accessToken: <string>botAccessToken
   };
   const kvStore: KVStoreClient = new KVStoreClient(kvOptions);

   const user_oauth_token: StoredOauthUserToken = await kvStore.getOauth2User(<string>user_id);
   if (!Object.keys(user_oauth_token).length) {
     throw new Exception(ExceptionType.MARKDOWN, i18nObj.__('forms.card_add.add_form.step_exception_2'));
   }

   const configStore: ConfigStoreProps = await kvStore.kvGet(StoreKeys.config);

   const trelloOptions: TrelloOptions = {
      apiKey: configStore.trello_apikey,
      token: configStore.trello_oauth_access_token
   }
   const trelloClient: TrelloClient = new TrelloClient(trelloOptions);
   const responseIntegration: TrelloWebhook[] = await tryPromise(trelloClient.getTrelloActiveWebhooks(), ExceptionType.MARKDOWN, i18nObj.__('error.trello'));
 
   return responseIntegration;
}
