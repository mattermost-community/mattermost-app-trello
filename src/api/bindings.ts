import { Request, Response } from 'express';

import { AppCallResponse, AppsState } from '../types';
import { newOKCallResponseWithData, showMessageToMattermost } from '../utils';
import { getAppBindings } from '../bindings';

export const getBindings = async (request: Request, response: Response) => {
    const bindings: AppsState[] = await getAppBindings(request.body);
    let callResponse: AppCallResponse;
    try {
        callResponse = newOKCallResponseWithData(bindings);
        response.json(callResponse);
    } catch (error: any) {
        callResponse = showMessageToMattermost(error);
        response.json(callResponse);
    }
};

