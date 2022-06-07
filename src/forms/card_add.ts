import { ConfigStoreProps, KVStoreClient, KVStoreOptions } from "../clients/kvstore";
import { TrelloClient, TrelloOptions } from "../clients/trello";
import { AppFieldTypes, Routes, TrelloIcon } from "../constant";
import { AppCallRequest, AppField, AppForm, AppSelectOption } from "../types";
import { tryGetTrelloConfig, tryGetUserOauthToken } from "../utils";

export async function cardAddFromStepOne(call: AppCallRequest): Promise<AppForm> {
  const mattermostUrl: string | undefined = call.context.mattermost_site_url;
  const botAccessToken: string | undefined = call.context.bot_access_token;
  const user_id = call.context.acting_user?.id;

  const options: KVStoreOptions = {
    mattermostUrl: <string>mattermostUrl,
    accessToken: <string>botAccessToken,
  };
  
  const kvClient = new KVStoreClient(options);
  const trelloConfig: ConfigStoreProps = await tryGetTrelloConfig(kvClient);
  const user_oauth_token = await tryGetUserOauthToken(kvClient, <string>user_id)

  return await getCreateCardForm({
    apiKey: trelloConfig.trello_apikey,
    token: user_oauth_token.oauth_token,
    workspace: trelloConfig.trello_workspace
  });
}

export async function cardAddFromStepTwo(call: AppCallRequest): Promise<AppForm> {
  const mattermostUrl: string | undefined = call.context.mattermost_site_url;
  const botAccessToken: string | undefined = call.context.bot_access_token;
  const board = call.values?.board;
  const card_name = call.values?.card_name;
  const user_id = call.context.acting_user?.id;

  const options: KVStoreOptions = {
    mattermostUrl: <string>mattermostUrl,
    accessToken: <string>botAccessToken,
  };
  
  const kvClient = new KVStoreClient(options);
  const trelloConfig: ConfigStoreProps = await tryGetTrelloConfig(kvClient);
  const user_oauth_token = await tryGetUserOauthToken(kvClient, <string>user_id)

  const trelloOptions = {
    apiKey: trelloConfig.trello_apikey,
    token: user_oauth_token.oauth_token,
    workspace: trelloConfig.trello_workspace
  }

  return await getCreateCardForm(trelloOptions, card_name, board);
}

async function getCreateCardForm(trelloOptions: TrelloOptions, card_name?: string, board?: AppSelectOption): Promise<AppForm> {
  const board_options: AppSelectOption[] = await getBoardOptionList(trelloOptions);
  let list_options: AppSelectOption[] = [];
  if (board)
    list_options = await getListOptionList(board?.value, trelloOptions);

  const fields: AppField[] = [
    {
      type: AppFieldTypes.TEXT,
      name: 'card_name',
      modal_label: 'Card Name',
      value: card_name? card_name : '',
      description: 'Name of the card',
      is_required: true,
    },
    {
      name: "board",
      modal_label: 'Select Board',
      refresh: true,
      value: board ? board : null,
      type: AppFieldTypes.STATIC_SELECT,
      options: board_options,
      is_required: true,
    }
  ]
  if (board) {
    fields.push({
      name: "list_select",
      modal_label: 'Select List',
      type: AppFieldTypes.STATIC_SELECT,
      options: list_options,
      is_required: true,
    })
  }

  const extra_text = board_options.length === 0 ? ' You don´t have any boards, ask to your admin for help' : '';
  const form: AppForm = {
    title: 'Create New Card',
    header: 'Fill the form with the card information.' + extra_text,
    icon: TrelloIcon,
    fields: fields,
    submit_label: 'next',
    submit: {
        path: `${Routes.App.Forms}${Routes.App.BindingPathCreateCard}${Routes.App.Submit}`,
        expand: {
        }
    },
    source: {
      path: `${Routes.App.Forms}${Routes.App.BindingPathCreateCard}${Routes.App.Form}`,
    }
  };
  return form;
}

export async function addFromCommand(call: AppCallRequest) {
  const mattermostUrl: string | undefined = call.context.mattermost_site_url;
  const botAccessToken: string | undefined = call.context.bot_access_token;
  const board_name = call.values?.board_name;
  const card_name = call.values?.card_name;
  const list_name = call.values?.list_name;
  const user_id = call.context.acting_user?.id;

  const options: KVStoreOptions = {
    mattermostUrl: <string>mattermostUrl,
    accessToken: <string>botAccessToken,
  };
  
  const kvClient = new KVStoreClient(options);
  const trelloConfig: ConfigStoreProps = await tryGetTrelloConfig(kvClient);
  const user_oauth_token = await tryGetUserOauthToken(kvClient, <string>user_id)

  const trelloOptions = {
    apiKey: trelloConfig.trello_apikey,
    token: user_oauth_token.oauth_token,
    workspace: trelloConfig.trello_workspace
  }

  const boards = await getBoardOptionList(trelloOptions);
  const board = boards.find((b) => b.label == board_name);
  if (board) {
    const lists = await getListOptionList(board.value, trelloOptions);
    const list = lists.find((l) => l.label == list_name);
    if (list) {
      const trelloClient =  new TrelloClient(trelloOptions);
      await trelloClient.sendCreateCardRequest(list.value, card_name);
    } else {
      throw Error(`List ${list_name} not found.`)
    }
  } else {
    throw Error(`Board ${board_name} not found.`)
  }
}

export async function getBoardOptionList(trelloOptions: TrelloOptions): Promise<AppSelectOption[]> {
  const trelloClient: TrelloClient = new TrelloClient(trelloOptions);

  const boards = await trelloClient.searchBoardsInOrganization();


  const options: AppSelectOption[] = [...boards.map((b: any) =>  { return { label: b.name, value: b.id}})];

  return options;
}

export async function getListOptionList(boardId: string, trelloOptions: TrelloOptions): Promise<AppSelectOption[]> {
  const trelloClient: TrelloClient = new TrelloClient(trelloOptions);

  const boards = await trelloClient.getListByBoard(boardId);


  const options: AppSelectOption[] = [...boards.map((b: any) =>  { return { label: b.name, value: b.id}})];

  return options;
}
