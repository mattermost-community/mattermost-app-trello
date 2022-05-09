import {Request, Response} from 'express';
import {AppBinding, AppCallResponse} from '../types';
import {newOKCallResponseWithData} from '../utils/call-responses';
import {getAppBindings} from '../bindings';

export const getBindings = async (request: Request, response: Response) => {
    const context = request.body.context;
    const bindings: AppBinding[] = getAppBindings(context);
    const callResponse: AppCallResponse = newOKCallResponseWithData(bindings);

    response.json(callResponse);
};

