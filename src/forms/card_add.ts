import { TrelloClient, TrelloOptions } from "../clients/trello";
import config from "../config";
import { AppFieldTypes, Routes, TrelloIcon } from "../constant";
import { AppCallRequest, AppForm, AppSelectOption } from "../types";

export async function cardAddFromStepOne(call: AppCallRequest): Promise<AppForm> {
  const mattermostUrl: string | undefined = call.context.mattermost_site_url;
  const botAccessToken: string | undefined = call.context.bot_access_token;

  const options: AppSelectOption[] = await getBoardOptionList();

  return {
    title: 'Create New Card',
    header: 'Fill the form with the card information.',
    icon: TrelloIcon,
    fields: [
        {
            type: AppFieldTypes.TEXT,
            name: 'card_name',
            modal_label: 'Card Name',
            value: 'new card',
            description: 'Name of the card',
            is_required: true,
        },
        {
          name: "board",
          modal_label: 'Select Board',
          type: AppFieldTypes.STATIC_SELECT,
          options: options,
          is_required: true,
        }
      ],
      submit_label: 'next',
      submit: {
          path: Routes.App.AddFormStepOnePath,
          expand: {
          }
      },
  } as AppForm;
}

export async function cardAddFromStepTwo(call: AppCallRequest): Promise<AppForm> {
  const mattermostUrl: string | undefined = call.context.mattermost_site_url;
  const botAccessToken: string | undefined = call.context.bot_access_token;
  const boardId = call.values?.board.value;
  const card_name = call.values?.card_name;

  const options: AppSelectOption[] = await getListOptionList(boardId);

  return {
    title: 'Create New Card',
    header: 'Fill the form with the card information.',
    icon: TrelloIcon,
    fields: [
        {
          type: AppFieldTypes.TEXT,
          name: 'card_name',
          modal_label: 'Card Name',
          value: card_name,
          description: 'Name of the card',
          is_required: true,
        },
        {
          name: "list_select",
          modal_label: 'Select List',
          type: AppFieldTypes.STATIC_SELECT,
          options: options,
          is_required: true,
        }
      ],
      submit_label: 'next',
      submit: {
          path: Routes.App.AddFormStepTwoPath,
          expand: {}
      },
  } as AppForm;
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
