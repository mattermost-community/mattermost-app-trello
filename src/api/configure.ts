import {
    AppCallRequestWithValues,
    AppCallResponse,
    AppCallValues,
} from '../types';

import { newConfigForm, submitConfigForm } from '../forms/trello_config';
import {
    CallResponseHandler,
    newFormCallResponse,
    newOKCallResponseWithMarkdown,
    showMessageToMattermost,
} from '../utils';

export const openTrelloConfigForm: CallResponseHandler = async (request, response) => {
    let callResponse: AppCallResponse;

    try {
        const form = await newConfigForm(request.body);
        callResponse = newFormCallResponse(form);
        response.json(callResponse);
    } catch (error: any) {
        callResponse = showMessageToMattermost(error);
        response.json(callResponse);
    }
};

export const submitTrelloConfig: CallResponseHandler = async (request, response) => {
    let callResponse: AppCallResponse;

    try {
        const message = await submitConfigForm(request.body);
        callResponse = newOKCallResponseWithMarkdown(message);
        response.json(callResponse);
    } catch (error: any) {
        callResponse = showMessageToMattermost(error);
        response.json(callResponse);
    }
};
