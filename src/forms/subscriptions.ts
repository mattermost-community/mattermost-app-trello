import queryString from "query-string";
import {head} from "lodash";
import {ConfigStoreProps, KVStoreClient, KVStoreOptions} from "../clients/kvstore";
import {TrelloClient, TrelloOptions} from "../clients/trello";
import {AppsPluginName, Routes, StoreKeys} from "../constant";
import {AppCallRequest, AppCallValues, Manifest} from "../types";
import {SubscriptionCreateForm} from "../constant/forms";
import {Board, SearchResponse, WebhookCreate} from "../types/trello";
import manifest from "../manifest.json";

export async function addSubscriptionCall(call: AppCallRequest): Promise<void> {
   const mattermostUrl: string | undefined = call.context.mattermost_site_url;
   const botAccessToken: string | undefined = call.context.bot_access_token;
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
   
   const trelloOptions: TrelloOptions = {
      apiKey: trelloConfig.trello_apikey,
      token: trelloConfig.trello_oauth_access_token,
      workspace: trelloConfig.trello_workspace
   };
   const trelloClient: TrelloClient = new TrelloClient(trelloOptions);

   const searchResponse: SearchResponse = await trelloClient.searchBoardByName(boardName);
   const board: Board | undefined = head(searchResponse.boards);
   if (!board) {
      throw new Error(`Not found board with name ${boardName}`);
   }

   const pluginName = m.app_id;
   const whPath = Routes.App.CallPathIncomingWebhookPath;
   const params = queryString.stringify({
      secret: whSecret
   });
   const url: string = `https://045b-201-160-207-97.ngrok.io/plugins/${AppsPluginName}/apps/${pluginName}${whPath}?${params}`;

   const payload: WebhookCreate = {
      description: `Mattermost_${channelName}_${channelId}`,
      idModel: board.id,
      callbackURL: url
   };
   await trelloClient.createTrelloWebhook(payload);
}
