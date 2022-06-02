import { Request, Response } from 'express'
import { AppCallRequest, AppCallResponse } from "../types";
import { newErrorCallResponseWithMessage, newOKCallResponseWithMarkdown } from '../utils';
import {addBulletSlashCommand, h5, joinLines} from "../utils/markdown";

export const getLogin = async (request: Request, response: Response) => {
  const call: AppCallRequest = request.body;

  let callResponse: AppCallResponse;

  const redirect = `[Follow link](https://trello.com/1/authorize?expiration=1day&name=mattermost_trello&scope=read,write&response_type=token&key=60cc02a7db35b9205fa8628d59a8e354)`

  const text = [
    getHeader(),
    redirect
  ].join(',');

  try {
    /// const form = await cardAddFromStepOne(call);
    // callResponse = newFormCallResponse(form);
    callResponse = newOKCallResponseWithMarkdown(text);
  } catch(error: any) { 
    callResponse = newErrorCallResponseWithMessage('Unable to create card form: ' + error.message);
  }
  return response.json(callResponse)
}

function getHeader(): string {
  return h5(`Mattermost Trello OAuth`);
}
