import {Request, Response} from 'express';
import {newErrorCallResponseWithMessage, newOKCallResponseWithMarkdown} from "../utils/call-responses";
import {AppAttachmentActionOptions, AppCallRequest, AppCallResponse, AppPostMessage} from "../types";
import { mattermostApi } from '../mattermost/mattermost-api';
import config from '../config';
import {Routes} from '../constant';
import { TrelloClient, TrelloOptions } from '../clients/trello';

export const listSelect = async (request: Request, response: Response) => {
  const listId = request.body.context.selected_option
  const token = request.body.context.token
  const channel = request.body.context.channel
  const cardName = request.body.context.cardName
  const mattermostUrl = request.body.context.mattermostUrl

  //const resultTrello = await trelloApi.sendCreateCardRequest({ cardName: cardName, listId })
  const trelloOptions: TrelloOptions = {
    apiKey: config.TRELLO.API_KEY,
    token: config.TRELLO.TOKEN,
  }

  const trelloClient: TrelloClient = new TrelloClient(trelloOptions);
  const resultTrello = await trelloClient.sendCreateCardRequest(listId, cardName);

  console.log(resultTrello);
  console.log(resultTrello.badges.attachmentsByType.trello)

  const message = {
    channel_id: channel,
    message: `New card created`,
    props: {
      attachments: [
        {
            author_icon: 'https://trello-members.s3.amazonaws.com/627ad9bcc8aeeb621b7dfd71/cd2acddb9dcc091de7f73b9200f4c4cf/30.png',
            author_name: 'jose lopez',
            author_link: 'https://trello.com/joselopez864',
            title: resultTrello.name,
            title_link: resultTrello.url,
            text: `Card ${cardName} added to board`,
        }]
  }}

  const hookMessage = {
      text: 'New card created from Hook',
      attachments: [
        {
            author_icon: 'https://trello-members.s3.amazonaws.com/627ad9bcc8aeeb621b7dfd71/cd2acddb9dcc091de7f73b9200f4c4cf/30.png',
            author_name: 'jose lopez',
            author_link: 'https://trello.com/joselopez864',
            title: resultTrello.name,
            title_link: resultTrello.url,
            text: `Card ${cardName} added to board`,
        }]
    }

  const result = await mattermostApi.postMessage(message, token, mattermostUrl);

  const hookResult = await mattermostApi.postToHook(hookMessage, 'jzyjmiwcdiya3go11ndobsewne', mattermostUrl)
  console.log(hookResult);

}

export const boardListSelect = async (request: Request, response: Response) => {
  console.log(request)
  const boardId = request.body.context.selected_option
  const token = request.body.context.token
  const channel = request.body.context.channel
  const cardName = request.body.context.cardName
  const mattermostUrl = request.body.context.mattermostUrl
  
  //const lists = await trelloApi.getListByBoard(boardId)

  const trelloOptions: TrelloOptions = {
    apiKey: config.TRELLO.API_KEY,
    token: config.TRELLO.TOKEN,
  }

  const trelloClient: TrelloClient = new TrelloClient(trelloOptions);
  const lists = await trelloClient.getListByBoard(boardId);
  console.log('testing the client')

  console.log(lists);

  const selectOptions: {value: string, text: string}[] = [];
    lists.forEach((o: any) => {
      selectOptions.push(
        {
          value: o.id,
          text: o.name 
        }
      )
    });

    const message: AppPostMessage = {
      channel_id: channel,
      message: 'Lists',
      props: {
        attachments: [
          {
              text: `Select the list to add the ${cardName} card`,
              actions: [
                  {
                    id: "message",
                    name: "Select an option...",
                    integration: {
                      url: `${config.APP.HOST}:${config.APP.PORT}${Routes.App.ListSelectPath}`,
                      context: {
                        action: "do_something",
                        token: token,
                        cardName: cardName,
                        channel: channel,
                        mattermostUrl: mattermostUrl
                      }
                    },
                    type: "select",
                    options: selectOptions
                  }
              ]
            }
          ]
        }
      }

      const result = await mattermostApi.postMessage(message, token, mattermostUrl);
}

export const getAdd = async (request: Request, response: Response) => {
  console.log(request)
  const call: AppCallRequest = request.body;
  const bot_token = call.context.bot_access_token?? '';
  let result = 'result test';
  let callResponse: AppCallResponse;
  callResponse = newOKCallResponseWithMarkdown(result);

  try {
    result = await addCommand(call, request.body, bot_token);
    callResponse = newOKCallResponseWithMarkdown(result);

  } catch(error: any) { 
    callResponse = newErrorCallResponseWithMessage('Unable to create card form: ' + error.message);
  }
  response.json(callResponse);
}

async function addCommand(call: AppCallRequest, body: any, token: string) {
  const boardName = body.board;
  const cardName = body.values.name;
  const mattermostUrl = body.context.mattermost_site_url;
  console.log('ADD COMMAND')
  console.log(mattermostUrl)

  // const board = await trelloApi.searchBoardByName(boardName);
  const trelloOptions: TrelloOptions = {
    apiKey: config.TRELLO.API_KEY,
    token: config.TRELLO.TOKEN,
  }

  const trelloClient: TrelloClient = new TrelloClient(trelloOptions);
  const board = await trelloClient.searchBoardByName(boardName);

  console.log(board.boards.length)
  if (board.boards.length < 1) {
    const organizations = await trelloClient.searchBoardsInOrganization();

    const selectOptions: AppAttachmentActionOptions[] = [];
    organizations.forEach((o: any) => {
      selectOptions.push(
        {
          value: o.id,
          text: o.name 
        }
      )
    });

    const message: AppPostMessage = {
      channel_id: call.context.channel.id,
      message: 'Boards',
      props: {
        attachments: [
          {
              text: "Select a board",
              actions: [
                  {
                    id: "message",
                    name: "Select an option...",
                    integration: {
                      url: `${config.APP.HOST}:${config.APP.PORT}${Routes.App.BoardSelectPath}`,
                      context: {
                        action: "do_something",
                        token: token,
                        cardName: cardName,
                        channel: call.context.channel.id,
                        mattermostUrl: mattermostUrl
                      }
                    },
                    type: "select",
                    options: selectOptions
                  }
              ]
            }
          ]
        }
      }

      const result = await mattermostApi.postMessage(message, token, mattermostUrl);
      return `board ${boardName} not found`
  }
    //return `board ${boardName} not found`;

  const lists = await trelloClient.getListByBoard(board.boards[0].id)

  if (lists.length < 1)
    return `board ${boardName} has no list`;

  const result = await trelloClient.sendCreateCardRequest(lists[0].id, cardName)
  return JSON.stringify(result);
}
