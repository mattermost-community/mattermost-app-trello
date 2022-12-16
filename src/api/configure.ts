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
    tryPromise,
} from '../utils';
import { TrelloClient, TrelloOptions } from '../clients/trello';
import { ConfigStoreProps, KVStoreClient, KVStoreOptions } from '../clients/kvstore';
import { ConfigureWorkspaceForm, ExceptionType, StoreKeys } from '../constant';
import { configureI18n } from '../utils/translations';

export const openTrelloConfigForm: CallResponseHandler = async (req, res) => {
    let callResponse: AppCallResponse;

    try {
        const form = await newConfigForm(req.body);
        callResponse = newFormCallResponse(form);
        res.json(callResponse);
    } catch (error: any) {
        callResponse = showMessageToMattermost(error);
        res.json(callResponse);
    }
};

export const submitTrelloConfig: CallResponseHandler = async (req, res) => {
    let callResponse: AppCallResponse;

    try {
        const message = await submitConfigForm(req.body);
        callResponse = newOKCallResponseWithMarkdown(message);
        res.json(callResponse);
    } catch (error: any) {
        callResponse = showMessageToMattermost(error);
        res.json(callResponse);
    }
};
