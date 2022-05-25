import {Request, Response} from 'express';
import {newErrorCallResponseWithMessage, newOKCallResponseWithMarkdown} from "../utils/call-responses";
import { AppCallRequest, AppCallResponse } from "../types";

export const getLink = async (request: Request, response: Response) => {
  console.log(request)
  const call: AppCallRequest = request.body;
  const bot_token = call.context.bot_access_token?? '';
  let result = '';
  let callResponse: AppCallResponse;
  callResponse = newOKCallResponseWithMarkdown(result);

  try {
    result = await linkCommand(call, request.body, bot_token);
    callResponse = newOKCallResponseWithMarkdown(result);

  } catch(error: any) { 
    callResponse = newErrorCallResponseWithMessage('Unable to link form: ' + error.message);
  }
  response.json(callResponse);
}

async function linkCommand(call: AppCallRequest, body: any, token: string) {
  console.log("LINK COMMAND")
  return 'linked to workspace';
}