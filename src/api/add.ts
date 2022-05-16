import {Request, Response} from 'express';
import {newErrorCallResponseWithMessage, newOKCallResponseWithMarkdown} from "../utils/call-responses";
import {AppCallRequest, AppCallResponse} from "../types";
import { trelloApi } from '../trello/trello-api';

export const getAdd = async (request: Request, response: Response) => {
  const call: AppCallRequest = request.body;
  console.log(call);
  let result = 'result test';
  let callResponse: AppCallResponse;

  try {
    result = await addCommand(request.body);
    callResponse = newOKCallResponseWithMarkdown(result);

  } catch(error: any) { 
    callResponse = newErrorCallResponseWithMessage('Unable to create card form: ' + error.message);
  }
  response.json(callResponse);
}

async function addCommand(body: any) {
  const boardName = body.board;
  const cardName = body.card;

  const board = await trelloApi.searchBoardByName(boardName);

  if (board.boards.length < 1)
    return `board ${boardName} not found`;

  const lists = await trelloApi.getListByBoard(board.boards[0].id)

  if (lists.length < 1)
    return `board ${boardName} has no list`;

  const result = await trelloApi.sendCreateCardRequest({ cardName: cardName, listId: lists[0].id })
  return JSON.stringify(result);
}