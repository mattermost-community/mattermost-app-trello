
import {
   AppCallRequest,
} from '../types';
import { ConfigStoreProps, KVStoreClient, KVStoreOptions } from '../clients/kvstore';
import { StoreKeys } from '../constant';
import { errorDataMessage, errorOpsgenieWithMessage, tryPromiseOpsgenieWithMessage } from '../utils/utils';
import { TrelloClient, TrelloOptions } from '../clients/trello';
import { TrelloWebhook } from '../types/trello';

export async function callSubscriptionList(call: AppCallRequest): Promise<TrelloWebhook[]> {
   const mattermostUrl: string | undefined = call.context.mattermost_site_url;
   const botAccessToken: string | undefined = call.context.bot_access_token;

   const options: KVStoreOptions = {
      mattermostUrl: <string>mattermostUrl,
      accessToken: <string>botAccessToken
   };
   const kvStore: KVStoreClient = new KVStoreClient(options);
   const configStore: ConfigStoreProps = await kvStore.kvGet(StoreKeys.config);

   const trelloOptions: TrelloOptions = {
      apiKey: configStore.trello_apikey,
      token: configStore.trello_oauth_access_token,
      workspace: configStore.trello_workspace
   }
   try {
      const trelloClient: TrelloClient = new TrelloClient(trelloOptions);
      const responseIntegration = await trelloClient.getTrelloActiveWebhooks();
      return responseIntegration;
   } catch (error: any) {
      throw new Error(errorOpsgenieWithMessage(error.response, `Unable to display current subscriptions`));
   }
}
