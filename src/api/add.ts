import {Request, Response} from 'express';
import {
  newFormCallResponse,
  newOKCallResponseWithMarkdown,
  showMessageToMattermost,
  tryPromise
} from "../utils";
import { AppCallRequest, AppCallResponse } from "../types";
import { TrelloClient } from '../clients/trello';
import { addFromCommand, cardAddFromStepOne, cardAddFromStepTwo, submitCreateCard } from '../forms/card_add';
import { ConfigStoreProps, KVStoreClient, KVStoreOptions } from '../clients/kvstore';
import { ExceptionType, StoreKeys } from '../constant';
import { Exception } from '../utils/exception';
import { configureI18n } from "../utils/translations";

export const getAdd = async (request: Request, response: Response) => {
  const call: AppCallRequest = request.body;

  let callResponse: AppCallResponse;
  try {
    if (call.values?.card_name && call.values?.board_name && call.values?.list_name) {
      const message = await addFromCommand(call);
      callResponse = newOKCallResponseWithMarkdown(message)
    }
    else {
      const form = await cardAddFromStepOne(call);
      callResponse = newFormCallResponse(form);
    }

    return response.json(callResponse);
  } catch(error: any) {
    callResponse = showMessageToMattermost(error);
    return response.json(callResponse);
  }
}

export const formStepOne = async (request: Request, response: Response) => {
  const call: AppCallRequest = request.body;
  let callResponse: AppCallResponse;

  try {
    const form = await cardAddFromStepTwo(call);
    callResponse = newFormCallResponse(form);
    return response.json(callResponse);
  } catch(error: any) { 
    callResponse = showMessageToMattermost(error);
    return response.json(callResponse);
  }
}

export const formStepTwo = async (request: Request, response: Response) => {
  const call: AppCallRequest = request.body;
  let callResponse: AppCallResponse;

  try {
    const message = await submitCreateCard(call);
    callResponse = newOKCallResponseWithMarkdown(message);
  } catch (error: any) {
    callResponse = showMessageToMattermost(error);
  }

  return response.json(callResponse);
}
