import {Request, Response} from 'express';
import {newErrorCallResponseWithMessage, newOKCallResponseWithMarkdown} from "../utils/call-responses";
import {AppAttachmentActionOptions, AppCallRequest, AppCallResponse, AppPostMessage} from "../types";
import { trelloApi } from '../trello/trello-api';
import { mattermostApi } from '../mattermost/mattermost-api';
import config from '../config';

export const listSelect = async (request: Request, response: Response) => {
  const listId = request.body.context.selected_option
  const token = request.body.context.token
  const channel = request.body.context.channel
  const cardName = request.body.context.cardName

  const resultTrello = await trelloApi.sendCreateCardRequest({ cardName: cardName, listId })

  const message = {
    channel_id: channel,
    message: `Card ${cardName} added to board`,
    props: {
      attachments: [
        {
            pretext: `Card ${cardName} added to board`,
            text: `Card ${cardName} added to board`,
        }]
  }}

  const result = await mattermostApi.postMessage(message, token);

}

export const boardListSelect = async (request: Request, response: Response) => {
  const boardId = request.body.context.selected_option
  const token = request.body.context.token
  const channel = request.body.context.channel
  const cardName = request.body.context.cardName
  
  const lists = await trelloApi.getListByBoard(boardId)

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
              pretext: "Select a List.",
              text: "List of lists",
              actions: [
                  {
                    id: "message",
                    name: "Select an option...",
                    integration: {
                      url: `${config.APP.HOST}:${config.APP.PORT}/list_select`,
                      context: {
                        action: "do_something",
                        token: token,
                        cardName: cardName,
                        channel: channel
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

      const result = await mattermostApi.postMessage(message, token);
}

export const getAdd = async (request: Request, response: Response) => {
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

  const board = await trelloApi.searchBoardByName(boardName);

  if (board.boards.length < 1) {
    const organizations = await trelloApi.searchBoardsInOrganization();

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
              pretext: "Select a board.",
              text: "List of boards",
              actions: [
                  {
                    id: "message",
                    name: "Select an option...",
                    integration: {
                      url: `${config.APP.HOST}:${config.APP.PORT}/board_select`,
                      context: {
                        action: "do_something",
                        token: token,
                        cardName: cardName,
                        channel: call.context.channel.id
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

      const result = await mattermostApi.postMessage(message, token);
      return `board ${boardName} not found`
  }
    //return `board ${boardName} not found`;

  const lists = await trelloApi.getListByBoard(board.boards[0].id)

  if (lists.length < 1)
    return `board ${boardName} has no list`;

  const result = await trelloApi.sendCreateCardRequest({ cardName: cardName, listId: lists[0].id })
  return JSON.stringify(result);
}
