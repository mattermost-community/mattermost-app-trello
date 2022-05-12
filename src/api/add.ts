import {Request, Response} from 'express';
import {newOKCallResponseWithMarkdown} from "../utils/call-responses";
import {AppCallRequest, AppCallResponse} from "../types";
import { trelloApi } from '../trello/trello-api';

export const getAdd = async (request: Request, response: Response) => {
  const call: AppCallRequest = request.body;
  console.log(call);
  const result = 'result test';
  await addCommand(request.body);

  const callResponse: AppCallResponse = newOKCallResponseWithMarkdown(result);
  response.json(callResponse);
}

async function addCommand(body: any) {
  const boardName = body.board;
  const cardName = body.card;

  const board = await trelloApi.searchBoardByName(boardName);

  const lists = await trelloApi.getListByBoard(board.boards[0].id)

  const result = await trelloApi.sendCreateCardRequest({ cardName: cardName, listId: lists[0].id })
}