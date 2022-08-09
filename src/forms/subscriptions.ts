import queryString from 'query-string';
import {head} from "lodash";
import {ConfigStoreProps, KVStoreClient, KVStoreOptions, StoredOauthUserToken} from "../clients/kvstore";
import {TrelloClient, TrelloOptions} from "../clients/trello";
import {
   SubscriptionCreateForm, 
   ExceptionType, 
   StoreKeys, 
   Routes, 
   SubscriptionRemoveForm
} from "../constant";
import {Board, SearchResponse, TrelloOrganization, TrelloWebhook, WebhookCreate} from "../types";
import {getHTTPPath, tryPromise} from "../utils";
import {Exception} from "../utils/exception";
import {AppCallRequest, AppCallValues} from "../types";

export async function addSubscriptionCall(call: AppCallRequest): Promise<void> {
   const mattermostUrl: string | undefined = call.context.mattermost_site_url;
   const botAccessToken: string | undefined = call.context.bot_access_token;
   const user_id: string | undefined = call.context.acting_user?.id;
   const whSecret: string | undefined = call.context.app?.webhook_secret;
   const values: AppCallValues | undefined = call.values;

   const boardName: string = values?.[SubscriptionCreateForm.BOARD_NAME];
   const channelId: string = values?.[SubscriptionCreateForm.CHANNEL_ID].value;
   const channelName: string = values?.[SubscriptionCreateForm.CHANNEL_ID].label;

   const kvOpts: KVStoreOptions = {
      mattermostUrl: <string>mattermostUrl,
      accessToken: <string>botAccessToken
   };
   const kvClient: KVStoreClient = new KVStoreClient(kvOpts);

   const user_oauth_token: StoredOauthUserToken = await kvClient.getOauth2User(<string>user_id);
   if (!Object.keys(user_oauth_token).length) {
     throw new Exception(ExceptionType.MARKDOWN, 'You are not logged in.');
   }

   const trelloConfig: ConfigStoreProps = await kvClient.kvGet(StoreKeys.config);

   const trelloOAuthOptions: TrelloOptions = {
      apiKey: trelloConfig.trello_apikey,
      token: user_oauth_token.oauth_token
   };
   const trelloOauthClient: TrelloClient = new TrelloClient(trelloOAuthOptions);
   const organization: TrelloOrganization = await tryPromise(trelloOauthClient.getOrganizationId(trelloConfig.trello_workspace), ExceptionType.MARKDOWN, 'Trello failed: ');
   const idOrganization = organization?.id;
   
   const searchResponse: SearchResponse = await tryPromise(trelloOauthClient.searchBoardByName(boardName, idOrganization), ExceptionType.MARKDOWN, 'Trello failed: ');
   const board: Board | undefined = head(searchResponse.boards);

   if (!board) {
      throw new Exception(ExceptionType.MARKDOWN, `Not found board with name "${boardName}"`);
   }
   const trelloOptions: TrelloOptions = {
      apiKey: trelloConfig.trello_apikey,
      token: trelloConfig.trello_oauth_access_token
   };
   const trelloClient: TrelloClient = new TrelloClient(trelloOptions);

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
   await tryPromise(trelloClient.createTrelloWebhook(payload), ExceptionType.MARKDOWN, 'Trello failed: ');
}

export async function removeWebhookCall(call: AppCallRequest): Promise<void> {
   const mattermostUrl: string | undefined = call.context.mattermost_site_url;
   const botAccessToken: string | undefined = call.context.bot_access_token;
   const user_id: string | undefined = call.context.acting_user?.id;
   const values: AppCallValues | undefined = call.values;
   const subscriptionID: string = values?.[SubscriptionRemoveForm.SUBSCRIPTION];

   const kvOpts: KVStoreOptions = {
      mattermostUrl: <string>mattermostUrl,
      accessToken: <string>botAccessToken
   };
   const kvClient: KVStoreClient = new KVStoreClient(kvOpts);

   const user_oauth_token: StoredOauthUserToken = await kvClient.getOauth2User(<string>user_id);
   if (!Object.keys(user_oauth_token).length) {
     throw new Exception(ExceptionType.MARKDOWN, 'You are not logged in.');
   }

   const trelloConfig: ConfigStoreProps = await kvClient.kvGet(StoreKeys.config);

   const trelloOptions: TrelloOptions = {
      apiKey: trelloConfig.trello_apikey,
      token: trelloConfig.trello_oauth_access_token
   };
   const trelloClient: TrelloClient = new TrelloClient(trelloOptions);
   const subscription: TrelloWebhook = await tryPromise(trelloClient.getTrelloWebhookByID(subscriptionID), ExceptionType.MARKDOWN, 'Trello failed: ');
   const subParams = new URL(<string>subscription.callbackURL)?.searchParams;
   const trelloOAuthOptions: TrelloOptions = {
      apiKey: trelloConfig.trello_apikey,
      token: user_oauth_token.oauth_token
   };

   const trelloOauthClient: TrelloClient = new TrelloClient(trelloOAuthOptions);
   await tryPromise(trelloOauthClient.getBoardById(<string>subParams.get('idModel')), ExceptionType.MARKDOWN, 'Trello failed: ');
   await tryPromise(trelloClient.deleteTrelloWebhook(subscriptionID), ExceptionType.MARKDOWN, 'Trello failed: ');
}
