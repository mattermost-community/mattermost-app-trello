import {Request, Response} from "express";
import {
    AppCallResponse,
    AppContext,
    Manifest,
    MattermostPluginWebhook,
    PostCreate,
    TrelloAction,
    TrelloApiUrlParams,
    TrelloModel,
    TrelloWebhookResponse
} from "../types";
import {newErrorCallResponseWithMessage, newOKCallResponse} from "../utils";
import {h5} from "../utils/markdown";
import {MattermostClient, MattermostOptions} from "../clients/mattermost";
import manifest from "../manifest.json";
import {Routes} from "../constant";
import config from "../config";

async function notifyCardMoved(event: TrelloWebhookResponse, context: AppContext) {
    const mattermostUrl: string | undefined = context.mattermost_site_url;
    const botAccessToken: string | undefined = context.bot_access_token;
    const action: TrelloAction = event.action;
    const cardModel: TrelloModel = event.model;

    const payload: PostCreate = {
        message: h5(`Card moved "${action.data.card.name}"  ("${action.data.board.name}" Board)`),
        channel_id: event.channel_id,
        props: {
            attachments: [
                {
                    author_icon: `${action.memberCreator.avatarUrl}/30.png`,
                    author_name: `${action.memberCreator.fullName}`,
                    title: `Board "${action.data.board.name}"`,
                    title_link: cardModel.url,
                    text: `Card "${action.data.card.name}" was moved (from "${action.data.listBefore.name}" list to "${action.data.listAfter.name}" list)`,
                }
            ]
        }
    };

    const mattermostOptions: MattermostOptions = {
        mattermostUrl: <string>mattermostUrl,
        accessToken: <string>botAccessToken
    };
    
    const mattermostClient: MattermostClient = new MattermostClient(mattermostOptions);
    await mattermostClient.createPost(payload);
}

async function notifyCardCreated(event: TrelloWebhookResponse, context: AppContext) {
    const mattermostUrl: string | undefined = context.mattermost_site_url;
    const botAccessToken: string | undefined = context.bot_access_token;
    const action: TrelloAction = event.action;
    const cardModel: TrelloModel = event.model;

    const payload: PostCreate = {
        message: h5(`Card created "${action.data.card.name}"  ("${action.data.board.name}" Board)`),
        channel_id: event.channel_id,
        props: {
            attachments: [
                {
                    author_icon: `${action.memberCreator.avatarUrl}/30.png`,
                    author_name: `${action.memberCreator.fullName}`,
                    title: `Board "${action.data.board.name}"`,
                    title_link: cardModel.url,
                    text: `Card "${action.data.card.name}" was created (in "${action.data.list.name}" list)`,
                }
            ]
        }
    };

    const mattermostOptions: MattermostOptions = {
        mattermostUrl: <string>mattermostUrl,
        accessToken: <string>botAccessToken
    };
    const mattermostClient: MattermostClient = new MattermostClient(mattermostOptions);
    await mattermostClient.createPost(payload);
}

const WEBHOOKS_ACTIONS: { [key: string]: Function } = {
    action_create_card: notifyCardCreated,
    action_move_card_from_list_to_list: notifyCardMoved
};

export const incomingWebhook = async (request: Request, response: Response) => {
    const data: TrelloWebhookResponse = request.body.values.data;
    const context: AppContext = request.body.context;
    let callResponse: AppCallResponse;
    try {
        const action: Function = WEBHOOKS_ACTIONS[data.action.display.translationKey];
        if (action) {
            await action(data, context);
        }
        callResponse = newOKCallResponse();
        response.json(callResponse);
    } catch (error: any) {
        callResponse = newErrorCallResponseWithMessage('Error webhook: ' + error.message);
        response.json(callResponse);
    }
};

export const notificationToMattermost = async (req: Request, res: Response) => {
    const m: Manifest = manifest;
    const call: TrelloWebhookResponse = req.body as TrelloWebhookResponse;
    const splitURL = req.url.split('/');
    const pluginWebhook = getUrlData(splitURL);
    
    const mattermostOptions: MattermostOptions = {
        accessToken: '',
        mattermostUrl: ''
    }
    let callResponse: AppCallResponse;

    try {
        const mattermostClient: MattermostClient = new MattermostClient(mattermostOptions);
        
        const pluginData: MattermostPluginWebhook = {
            mattermostUrl: new URL(createContext(pluginWebhook)).href,
            appID: m.app_id,
            whPath: Routes.Mattermost.webhook,
            whSecret: pluginWebhook.secret
        }
        call.channel_id = pluginWebhook.channel;
        await mattermostClient.webhookPlugin(pluginData, call);
        callResponse = newOKCallResponse();
        res.json(callResponse);
    } catch (error: any) {
        callResponse = newErrorCallResponseWithMessage('Error webhook: ' + error.message);
        return res.json(callResponse);
    }
}

const getUrlData = (dataURL: string[]): TrelloApiUrlParams => {
    const utilKeys = dataURL.map(key => {
        if (key.includes('_')){
            return key.split('_');
        }
        return [];
    }).filter(key => !!key.length);

    const apiParams = utilKeys.reduce((o: any, key) => Object.assign(o, { [key[0]]: key[1] }), {});
    
    return apiParams as TrelloApiUrlParams;
}

const createContext = (plugin: TrelloApiUrlParams): string => {
    if (config.MATTERMOST.USE) {
        return config.MATTERMOST.URL;
    }
    
    return new URL(plugin.context).href;
}
