import queryString from "query-string";
import {head} from "lodash";
import {ConfigStoreProps, KVStoreClient, KVStoreOptions} from "../clients/kvstore";
import {TrelloClient, TrelloOptions} from "../clients/trello";
import {AppsPluginName, Routes, StoreKeys} from "../constant";
import {AppCallRequest, AppCallValues, AppContext, AppSelectOption, Manifest} from "../types";
import {SubscriptionCreateForm} from "../constant/forms";
import {Board, SearchResponse, TrelloApiUrlParams, WebhookCreate} from "../types/trello";
import manifest from "../manifest.json";
import { TrelloAPIWebhook } from "../constant/trello-webhook";
import { callSubscriptionList } from "./subscription-list";
import { h6, joinLines } from "../utils/markdown";
import { getBoardOptionList } from "./card_add";

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
      token: user_oauth_token.oauth_token,
      workspace: trelloConfig.trello_workspace
   };
   const trelloClient: TrelloClient = new TrelloClient(trelloOptions);
   const idOrganization = (await trelloClient.getOrganizationId())?.id;
   
   const searchResponse: SearchResponse = await trelloClient.searchBoardByName(boardName, idOrganization);
   const board: Board | undefined = head(searchResponse.boards);

   if (!board) {
      throw new Error(`Not found board with name "${boardName}" in current workspace (${trelloOptions.workspace})`);
   }

   const trelloAPiParams: TrelloApiUrlParams = {
      context: (new URL(<string>mattermostUrl)).hostname,
      secret: <string>whSecret,
      idModel: board.id,
      channel: channelId
   }
   
   const url: string = TrelloAPIWebhook(trelloAPiParams);

   const payload: WebhookCreate = {
      description: `Channel: ${channelName} - Board: ${board?.name}`,
      idModel: board.id,
      callbackURL: url
   };
   await trelloClient.createTrelloWebhook(payload);
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
   await trelloClient.deleteTrelloWebhook(subscription);
}

export async function listWebhookCall(context: AppContext): Promise<string> {
   const integrations: AppSelectOption[] = await callSubscriptionList(context);
   const subscriptionsText: string = [
      h6(`Subscription List: Found ${integrations.length} open subscriptions.`),
      `${joinLines(
         integrations.map((integration: AppSelectOption) => {
            return `- Subscription ID: "${integration.value}" - ${integration.label}`;
         }).join('\n')
      )}`
   ].join('');
   return subscriptionsText;
}