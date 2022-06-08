
import {
   AppCallRequest, AppContext, AppSelectOption,
} from '../types';
import { ConfigStoreProps, KVStoreClient, KVStoreOptions } from '../clients/kvstore';
import { StoreKeys } from '../constant';
import { errorDataMessage, errorWithMessage, tryPromiseOpsgenieWithMessage } from '../utils/utils';
import { TrelloClient, TrelloOptions } from '../clients/trello';
import { TrelloWebhook } from '../types/trello';

export async function callSubscriptionList(context: AppContext): Promise<AppSelectOption[]> {
   const mattermostUrl: string | undefined = context.mattermost_site_url;
   const botAccessToken: string | undefined = context.bot_access_token;
   const user_id: string | undefined = context.acting_user?.id;

   const options: KVStoreOptions = {
      mattermostUrl: <string>mattermostUrl,
      accessToken: <string>botAccessToken
   };
   const kvStore: KVStoreClient = new KVStoreClient(options);
   const configStore: ConfigStoreProps = await kvStore.kvGet(StoreKeys.config);
   const user_oauth_token = await kvStore.getOauth2User(<string>user_id)

   const trelloOptions: TrelloOptions = {
      apiKey: configStore.trello_apikey,
      token: user_oauth_token.oauth_token, 
      workspace: configStore.trello_workspace
   }
   try {
      const trelloClient: TrelloClient = new TrelloClient(trelloOptions);
      const responseIntegration = await trelloClient.getTrelloActiveWebhooks();
      const options: AppSelectOption[] = responseIntegration.map(res => {
         return {
            label: res.description,
            value: res.id
         } as AppSelectOption;
      });
      
      return options;
   } catch (error: any) {
      throw new Error(errorWithMessage(error.response, `Unable to display current subscriptions`));
   }
}
