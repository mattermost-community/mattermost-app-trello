import {Request, Response} from 'express';
import { AppCallResponse, AppsState} from '../types';
import {newOKCallResponseWithData} from '../utils';
import {getAppBindings} from '../bindings';

export const getBindings = async (request: Request, response: Response) => {
    const context = request.body.context;
    const bindings: AppsState[] = getAppBindings(context);
    const callResponse: AppCallResponse = newOKCallResponseWithData(bindings);

    response.json(callResponse);
};

