import { TrelloClient, TrelloOptions } from "../clients/trello";
import config from "../config";
import { AppFieldTypes, Routes, TrelloIcon } from "../constant";
import { AppCallRequest, AppField, AppForm, AppSelectOption } from "../types";

export async function cardAddFromStepOne(call: AppCallRequest): Promise<AppForm> {
  const mattermostUrl: string | undefined = call.context.mattermost_site_url;
  const botAccessToken: string | undefined = call.context.bot_access_token;

  return await getCreateCardForm();
}

export async function cardAddFromStepTwo(call: AppCallRequest): Promise<AppForm> {
  const mattermostUrl: string | undefined = call.context.mattermost_site_url;
  const botAccessToken: string | undefined = call.context.bot_access_token;
  const board = call.values?.board;
  const card_name = call.values?.card_name;

  return await getCreateCardForm(card_name, board);
}

async function getCreateCardForm(card_name?: string, board?: AppSelectOption): Promise<AppForm> {
  const board_options: AppSelectOption[] = await getBoardOptionList();
  let list_options: AppSelectOption[] = [];
  if (board)
    list_options = await getListOptionList(board?.value);

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

async function getBoardOptionList(): Promise<AppSelectOption[]> {
  const trelloOptions: TrelloOptions = {
    apiKey: config.TRELLO.API_KEY,
    token: config.TRELLO.TOKEN,
  }

  const trelloClient: TrelloClient = new TrelloClient(trelloOptions);

  const boards = await trelloClient.searchBoardsInOrganization();


  const options: AppSelectOption[] = [...boards.map((b: any) =>  { return { label: b.name, value: b.id}})];

  return options;
}

async function getListOptionList(boardId: string): Promise<AppSelectOption[]> {
  const trelloOptions: TrelloOptions = {
    apiKey: config.TRELLO.API_KEY,
    token: config.TRELLO.TOKEN,
  }

  const trelloClient: TrelloClient = new TrelloClient(trelloOptions);

  const boards = await trelloClient.getListByBoard(boardId);


  const options: AppSelectOption[] = [...boards.map((b: any) =>  { return { label: b.name, value: b.id}})];

  return options;
}
