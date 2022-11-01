import { ConfigStoreProps, KVStoreClient, KVStoreOptions, StoredOauthUserToken } from "../clients/kvstore";
import { TrelloClient, TrelloOptions } from "../clients/trello";
import { AppFieldTypes, ExceptionType, Routes, StoreKeys, TrelloIcon } from "../constant";
import {AppCallRequest, AppCallValues, AppContext, AppField, AppForm, AppSelectOption} from "../types";
import { tryPromise } from "../utils";
import { Exception } from "../utils/exception";
import { configureI18n } from "../utils/translations";

export async function cardAddFromStepOne(call: AppCallRequest): Promise<AppForm> {
  const mattermostUrl: string | undefined = call.context.mattermost_site_url;
  const botAccessToken: string | undefined = call.context.bot_access_token;
  const user_id = call.context.acting_user?.id;
	const i18nObj = configureI18n(call.context);

  const options: KVStoreOptions = {
    mattermostUrl: <string>mattermostUrl,
    accessToken: <string>botAccessToken,
  };
  
  const kvClient = new KVStoreClient(options);
  const trelloConfig: ConfigStoreProps = await kvClient.kvGet(StoreKeys.config);
  if (!Object.keys(trelloConfig).length) {
    throw new Exception(ExceptionType.MARKDOWN, i18nObj.__('forms.card_add.add_form.step_exception_1'));
  }

  const user_oauth_token = await kvClient.getOauth2User(<string>user_id);
  if (!Object.keys(user_oauth_token).length) {
    throw new Exception(ExceptionType.MARKDOWN, i18nObj.__('forms.card_add.add_form.step_exception_2'));
  }

  const trelloOptions: TrelloOptions = {
    apiKey: trelloConfig.trello_apikey,
    token: user_oauth_token.oauth_token
  };
  return await getCreateCardForm(trelloOptions, trelloConfig.trello_workspace, call.context);
}

export async function cardAddFromStepTwo(call: AppCallRequest): Promise<AppForm> {
  const mattermostUrl: string | undefined = call.context.mattermost_site_url;
  const botAccessToken: string | undefined = call.context.bot_access_token;
  const board = call.values?.board;
  const card_name = call.values?.card_name;
  const user_id = call.context.acting_user?.id;
	const i18nObj = configureI18n(call.context);

  const options: KVStoreOptions = {
    mattermostUrl: <string>mattermostUrl,
    accessToken: <string>botAccessToken,
  };
  
  const kvClient = new KVStoreClient(options);
  const trelloConfig: ConfigStoreProps = await kvClient.kvGet(StoreKeys.config);
  if (!Object.keys(trelloConfig).length) {
    throw new Exception(ExceptionType.MARKDOWN, i18nObj.__('forms.card_add.add_form.step_exception_1'));
  }

  const user_oauth_token = await kvClient.getOauth2User(<string>user_id);
  if (!Object.keys(user_oauth_token).length) {
    throw new Exception(ExceptionType.MARKDOWN, i18nObj.__('forms.card_add.add_form.step_exception_2'));
  }

  const trelloOptions = {
    apiKey: trelloConfig.trello_apikey,
    token: user_oauth_token.oauth_token
  }

  return await getCreateCardForm(trelloOptions, trelloConfig.trello_workspace, call.context, card_name, board);
}

async function getCreateCardForm(trelloOptions: TrelloOptions, workspace: string, context: AppContext, card_name?: string, board?: AppSelectOption): Promise<AppForm> {
  const board_options: AppSelectOption[] = await getBoardOptionList(trelloOptions, workspace, context);
  let list_options: AppSelectOption[] = [];
	const i18nObj = configureI18n(context);
  if (board) {
    list_options = await getListOptionList(board?.value, trelloOptions, context);
  }

  const fields: AppField[] = [
    {
      type: AppFieldTypes.TEXT,
      name: 'card_name',
      modal_label: i18nObj.__('forms.card_add.create.label_card'),
      value: card_name? card_name : '',
      description: i18nObj.__('forms.card_add.create.description_card'),
      is_required: true,
    },
    {
      name: "board",
      modal_label: i18nObj.__('forms.card_add.create.label_board'),
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
      modal_label: i18nObj.__('forms.card_add.create.label_select'),
      type: AppFieldTypes.STATIC_SELECT,
      options: list_options,
      is_required: true,
    })
  }

  const extra_text = !board_options.length ? i18nObj.__('forms.card_add.create.extra_text') : '';
  const form: AppForm = {
    title: i18nObj.__('forms.card_add.create.new_card'),
    header: i18nObj.__('forms.card_add.create.header_card') + extra_text,
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
  const user_id: string | undefined = call.context.acting_user?.id;
  const values: AppCallValues | undefined = call.values;
	const i18nObj = configureI18n(call.context);

  const board_name: string = values?.board_name;
  const card_name: string = values?.card_name;
  const list_name: string = values?.list_name;

  const options: KVStoreOptions = {
    mattermostUrl: <string>mattermostUrl,
    accessToken: <string>botAccessToken,
  };
  
  const kvClient = new KVStoreClient(options);
  const trelloConfig: ConfigStoreProps = await kvClient.kvGet(StoreKeys.config);
  if (!Object.keys(trelloConfig).length) {
    throw new Exception(ExceptionType.MARKDOWN, i18nObj.__('forms.card_add.add_form.step_exception_1'));
  }

  const user_oauth_token: StoredOauthUserToken = await kvClient.getOauth2User(<string>user_id);
  if (!Object.keys(user_oauth_token).length) {
    throw new Exception(ExceptionType.MARKDOWN, i18nObj.__('forms.card_add.add_form.step_exception_2'));
  }

  const trelloOptions: TrelloOptions = {
    apiKey: trelloConfig.trello_apikey,
    token: user_oauth_token.oauth_token
  }

  const boards = await getBoardOptionList(trelloOptions, trelloConfig.trello_workspace, call.context);
  const board = boards.find((b) => b.label == board_name);
  if (board) {
    const lists = await getListOptionList(board.value, trelloOptions, call.context);
    const list = lists.find((l) => l.label == list_name);
    if (list) {
      const trelloClient =  new TrelloClient(trelloOptions);
      await tryPromise(trelloClient.sendCreateCardRequest(list.value, card_name), ExceptionType.MARKDOWN, i18nObj.__('error.trello'));
    } else {
      throw new Exception(ExceptionType.MARKDOWN, i18nObj.__('forms.card_add.add.list_not_found', { name: list_name}));
    }
  } else {
    throw new Exception(ExceptionType.MARKDOWN, i18nObj.__('forms.card_add.add.board_not_found', { nbame: board_name }));
  }
}

export async function getBoardOptionList(trelloOptions: TrelloOptions, workspace: string, context: AppContext): Promise<AppSelectOption[]> {
	const i18nObj = configureI18n(context);
  const trelloClient: TrelloClient = new TrelloClient(trelloOptions);

  const boards = await tryPromise(trelloClient.searchBoardsInOrganization(workspace), ExceptionType.MARKDOWN, i18nObj.__('error.trello'));

  const options: AppSelectOption[] = [...boards.map((b: any) =>  { return { label: b.name, value: b.id}})];

  return options;
}

export async function getListOptionList(boardId: string, trelloOptions: TrelloOptions, context: AppContext): Promise<AppSelectOption[]> {
		const i18nObj = configureI18n(context);
		const trelloClient: TrelloClient = new TrelloClient(trelloOptions);

  const boards = await tryPromise(trelloClient.getListByBoard(boardId), ExceptionType.MARKDOWN, i18nObj.__('error.trello'));

  const options: AppSelectOption[] = [...boards.map((b: any) =>  { return { label: b.name, value: b.id}})];

  return options;
}
