import {head} from "lodash";
import {ConfigStoreProps, KVStoreClient, KVStoreOptions} from "../clients/kvstore";
import {TrelloClient, TrelloOptions} from "../clients/trello";
import {SubscriptionCreateForm, ExceptionType, StoreKeys, Routes} from "../constant";
import {Board, SearchResponse, TrelloOrganization, WebhookCreate} from "../types";
import {getHTTPPath, tryPromise} from "../utils";
import {Exception} from "../utils/exception";
import {AppCallRequest, AppCallValues, AppContext} from "../types";

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

   const trelloConfig: ConfigStoreProps = await kvClient.kvGet(StoreKeys.config);
   const user_oauth_token = await kvClient.getOauth2User(<string>user_id)
   
   const trelloOptions: TrelloOptions = {
      apiKey: trelloConfig.trello_apikey,
      token: user_oauth_token.oauth_token,
      workspace: trelloConfig.trello_workspace
   };
   const trelloClient: TrelloClient = new TrelloClient(trelloOptions);
   const organization: TrelloOrganization = await tryPromise(trelloClient.getOrganizationId(), ExceptionType.MARKDOWN, 'Trello failed ');
   const idOrganization = organization?.id;
   
   const searchResponse: SearchResponse = await tryPromise(trelloClient.searchBoardByName(boardName, idOrganization), ExceptionType.MARKDOWN, 'Trello failed ');
   const board: Board | undefined = head(searchResponse.boards);

   if (!board) {
      throw new Exception(ExceptionType.MARKDOWN, `Not found board with name ${boardName}`);
   }

   const domain: string = (new URL(<string>mattermostUrl)).hostname;
   const idModel: string = board.id;

   const callbackURL: string = `${getHTTPPath()}${Routes.App.CallReceiveNotification}/context_${domain}/secret_${whSecret}/model_${idModel}/channel_${channelId}`;
   const payload: WebhookCreate = {
      description: `Channel: ${channelName} - Board: ${board?.name}`,
      idModel: board.id,
      callbackURL
   };
   await tryPromise(trelloClient.createTrelloWebhook(payload), ExceptionType.MARKDOWN, 'Trello failed ');
}

export async function removeWebhookCall(call: AppCallRequest): Promise<void> {
   const values = call.values;
   const subscription = values?.subscription as string;
   const context = call.context as AppContext;
   const user_id: string | undefined = context.acting_user?.id;
   const kvOpts: KVStoreOptions = {
      mattermostUrl: context.mattermost_site_url || '',
      accessToken: context.bot_access_token || ''
   };

   const kvClient: KVStoreClient = new KVStoreClient(kvOpts);
   const trelloConfig: ConfigStoreProps = await kvClient.kvGet(StoreKeys.config) as ConfigStoreProps;
   const user_oauth_token = await kvClient.getOauth2User(<string>user_id)

   const trelloOptions: TrelloOptions = {
      apiKey: trelloConfig.trello_apikey,
      token: user_oauth_token.oauth_token, 
      workspace: trelloConfig.trello_workspace
   };

   const trelloClient: TrelloClient = new TrelloClient(trelloOptions);
   await tryPromise(trelloClient.deleteTrelloWebhook(subscription), ExceptionType.MARKDOWN, 'Trello failed ');
}
