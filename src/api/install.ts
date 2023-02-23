import { Request, Response } from 'express';

import { AppCallRequest, AppCallResponse } from '../types';
import { newOKCallResponseWithMarkdown, showMessageToMattermost } from '../utils';
import { joinLines } from '../utils/markdown';
import manifest from '../manifest.json';
import { configureI18n } from '../utils/translations';

export const getInstall = async (request: Request, response: Response) => {
    const call: AppCallRequest = request.body;

    const helpText: string = [
        getCommands(request.body),
    ].join('');
    let callResponse: AppCallResponse;

    try {
        callResponse = newOKCallResponseWithMarkdown(helpText);
        response.json(callResponse);
    } catch (error: any) {
        callResponse = showMessageToMattermost(error);
        response.json(callResponse);
    }
};

function getCommands(call: AppCallRequest): string {
    const i18nObj = configureI18n(call.context);
    const homepageUrl: string = manifest.homepage_url;
    return `${joinLines(
        i18nObj.__('api.install.description', { homepageUrl })
    )}\n`;
}
