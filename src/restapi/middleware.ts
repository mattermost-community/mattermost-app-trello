import { Request, Response } from 'express';

import Exception from '../utils/exception';

import { ExceptionType } from '../constant';

import { AppActingUser, AppCallRequest, Oauth2App } from '../types';
import { configureI18n } from '../utils/translations';
import { existsToken, isUserSystemAdmin, showMessageToMattermost } from '../utils/utils';

export const requireSystemAdmin = (req: Request, res: Response, next: () => void) => {
    const call: AppCallRequest = req.body;
    const i18nObj = configureI18n(call.context);
    const actingUser: AppActingUser = call.context.acting_user as AppActingUser;

    if (!actingUser) {
        res.json(showMessageToMattermost(new Exception(ExceptionType.TEXT_ERROR, i18nObj.__('general.validation-user.not-provided'), call.context.mattermost_site_url, call.context.app_path)));
        return;
    }

    if (!isUserSystemAdmin(actingUser)) {
        res.json(showMessageToMattermost(new Exception(ExceptionType.TEXT_ERROR, i18nObj.__('general.validation-user.system-admin'), call.context.mattermost_site_url, call.context.app_path)));
        return;
    }

    next();
};

export const requireUserOAuthConnected = (req: Request, res: Response, next: () => void) => {
    const call: AppCallRequest = req.body;
    const i18nObj = configureI18n(call.context);
    const oauth2: Oauth2App = call.context.oauth2 as Oauth2App;

    if (!existsToken(oauth2)) {
        res.json(showMessageToMattermost(new Exception(ExceptionType.TEXT_ERROR, i18nObj.__('general.validation-user.oauth-user'), call.context.mattermost_site_url, call.context.app_path)));
        return;
    }

    next();
};

export const requireUserOAuthDisconnected = (req: Request, res: Response, next: () => void) => {
    const call: AppCallRequest = req.body;
    const i18nObj = configureI18n(call.context);
    const oauth2: Oauth2App = call.context.oauth2 as Oauth2App;

    if (existsToken(oauth2)) {
        res.json(showMessageToMattermost(new Exception(ExceptionType.TEXT_ERROR, i18nObj.__('general.validation-user.oauth-user-already'), call.context.mattermost_site_url, call.context.app_path)));
        return;
    }

    next();
};