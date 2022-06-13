import queryString from 'query-string';
import {head} from "lodash";
import {ConfigStoreProps, KVStoreClient, KVStoreOptions, StoredOauthUserToken} from "../clients/kvstore";
import {TrelloClient, TrelloOptions} from "../clients/trello";
import {
   SubscriptionCreateForm, 
   ExceptionType, 
   StoreKeys, 
   Routes, 
   SubscriptionRemoveForm, 
   AppsPluginName
} from "../constant";
import {Board, Manifest, SearchResponse, TrelloOrganization, WebhookCreate} from "../types";
import {getHTTPPath, tryPromise} from "../utils";
import {Exception} from "../utils/exception";
import {AppCallRequest, AppCallValues} from "../types";
import manifest from "../manifest.json";

export async function addSubscriptionCall(call: AppCallRequest): Promise<void> {
   const mattermostUrl: string | undefined = call.context.mattermost_site_url;
   const botAccessToken: string | undefined = call.context.bot_access_token;
   const user_id: string | undefined = call.context.acting_user?.id;
   const whSecret: string | undefined = call.context.app?.webhook_secret;
   const values: AppCallValues | undefined = call.values;

   const m: Manifest = manifest;

   const boardName: string = values?.[SubscriptionCreateForm.BOARD_NAME];
   const channelId: string = values?.[SubscriptionCreateForm.CHANNEL_ID].value;
   const channelName: string = values?.[SubscriptionCreateForm.CHANNEL_ID].label;

   const kvOpts: KVStoreOptions = {
      mattermostUrl: <string>mattermostUrl,
      accessToken: <string>botAccessToken
   };
   const kvClient: KVStoreClient = new KVStoreClient(kvOpts);

   const trelloConfig: ConfigStoreProps = await kvClient.kvGet(StoreKeys.config);
   const user_oauth_token = await kvClient.getOauth2User(<string>user_id)
   
   const trelloOptions: TrelloOptions = {
      apiKey: trelloConfig.trello_apikey,
      token: user_oauth_token.oauth_token
   };
   const trelloClient: TrelloClient = new TrelloClient(trelloOptions);
   const organization: TrelloOrganization = await tryPromise(trelloClient.getOrganizationId(trelloConfig.trello_workspace), ExceptionType.MARKDOWN, 'Trello failed ');
   const idOrganization = organization?.id;
   
   const searchResponse: SearchResponse = await tryPromise(trelloClient.searchBoardByName(boardName, idOrganization), ExceptionType.MARKDOWN, 'Trello failed ');
   const board: Board | undefined = head(searchResponse.boards);

   if (!board) {
      throw new Exception(ExceptionType.MARKDOWN, `Not found board with name ${boardName}`);
   }

   const idModel: string = board.id;
   const params: string = queryString.stringify({
      secret: whSecret,
      idModel,
      channelId,
      mattermostUrl
   });
   const url: string = `${getHTTPPath()}${Routes.App.CallSubscriptionReceiveNotification}?${params}`

   const payload: WebhookCreate = {
      description: `Channel: ${channelName} - Board: ${board?.name}`,
      idModel: board.id,
      callbackURL: url
   };
   await tryPromise(trelloClient.createTrelloWebhook(payload), ExceptionType.MARKDOWN, 'Trello failed ');
}

export async function removeWebhookCall(call: AppCallRequest): Promise<void> {
   const mattermostUrl: string | undefined = call.context.mattermost_site_url;
   const botAccessToken: string | undefined = call.context.bot_access_token;
   const user_id: string | undefined = call.context.acting_user?.id;
   const values: AppCallValues | undefined = call.values;

   const subscription: string = values?.[SubscriptionRemoveForm.SUBSCRIPTION];

   const kvOpts: KVStoreOptions = {
      mattermostUrl: <string>mattermostUrl,
      accessToken: <string>botAccessToken
   };
   const kvClient: KVStoreClient = new KVStoreClient(kvOpts);

   const trelloConfig: ConfigStoreProps = await kvClient.kvGet(StoreKeys.config);
   const user_oauth_token: StoredOauthUserToken = await kvClient.getOauth2User(<string>user_id)

   const trelloOptions: TrelloOptions = {
      apiKey: trelloConfig.trello_apikey,
      token: user_oauth_token.oauth_token
   };
   const trelloClient: TrelloClient = new TrelloClient(trelloOptions);

   await tryPromise(trelloClient.deleteTrelloWebhook(subscription), ExceptionType.MARKDOWN, 'Trello failed ');
}
