import {head} from "lodash";
import {ConfigStoreProps, KVStoreClient, KVStoreOptions} from "../clients/kvstore";
import {TrelloClient, TrelloOptions} from "../clients/trello";
import {Routes, StoreKeys} from "../constant";
import {AppCallRequest, AppCallValues} from "../types";
import {SubscriptionCreateForm, ExceptionType} from "../constant";
import {Board, SearchResponse, WebhookCreate} from "../types";
import {getHTTPPath, tryPromise} from "../utils";
import {Exception} from "../utils/exception";

export async function addSubscriptionCall(call: AppCallRequest): Promise<void> {
   const mattermostUrl: string | undefined = call.context.mattermost_site_url;
   const botAccessToken: string | undefined = call.context.bot_access_token;
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
   
   const trelloOptions: TrelloOptions = {
      apiKey: trelloConfig.trello_apikey,
      token: trelloConfig.trello_oauth_access_token,
      workspace: trelloConfig.trello_workspace
   };
   const trelloClient: TrelloClient = new TrelloClient(trelloOptions);

   const searchResponse: SearchResponse = await trelloClient.searchBoardByName(boardName);
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
