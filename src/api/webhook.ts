import {Request, Response} from "express";
import queryString, { ParsedQuery } from 'query-string';
import {
    AppCallResponse,
    AppContext,
    PostCreate,
    TrelloAction,
    TrelloModel,
    TrelloWebhookResponse,
    WebhookRequest
} from "../types";
import {newErrorCallResponseWithMessage, newOKCallResponse} from "../utils";
import {h5} from "../utils/markdown";
import {MattermostClient, MattermostOptions} from "../clients/mattermost";

async function notifyCardMoved(event: WebhookRequest<TrelloWebhookResponse>, context: AppContext) {
    const mattermostUrl: string | undefined = context.mattermost_site_url;
    const botAccessToken: string | undefined = context.bot_access_token;
    const action: TrelloAction = event.data.action;
    const cardModel: TrelloModel = event.data.model;
    const rawQuery: string = event.rawQuery;

    const parsedQuery: ParsedQuery = queryString.parse(rawQuery);
    const channelId: string = <string>parsedQuery['channelId'];

    const payload: PostCreate = {
        message: h5(`Card moved "${action.data.card.name}"  ("${action.data.board.name}" Board)`),
        channel_id: channelId,
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

async function notifyCardCreated(event: WebhookRequest<TrelloWebhookResponse>, context: AppContext) {
    const mattermostUrl: string | undefined = context.mattermost_site_url;
    const botAccessToken: string | undefined = context.bot_access_token;
    const action: TrelloAction = event.data.action;
    const cardModel: TrelloModel = event.data.model;
    const rawQuery: string = event.rawQuery;

    const parsedQuery: ParsedQuery = queryString.parse(rawQuery);
    const channelId: string = <string>parsedQuery['channelId'];

    const payload: PostCreate = {
        message: h5(`Card created "${action.data.card.name}"  ("${action.data.board.name}" Board)`),
        channel_id: channelId,
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
    console.log('incomingWebhook', request.body);
    const webhookRequest: WebhookRequest<any> = request.body.values;
    const context: AppContext = request.body.context;
    
    let callResponse: AppCallResponse;

    try {
        const action: Function = WEBHOOKS_ACTIONS[webhookRequest.data.action.display.translationKey];
        if (action) {
            await action(webhookRequest, context);
        }
        callResponse = newOKCallResponse();
        response.json(callResponse);
    } catch (error: any) {
        callResponse = newErrorCallResponseWithMessage('Error webhook: ' + error.message);
        response.json(callResponse);
    }
};

export const notificationToMattermost = async (req: Request, res: Response) => {
    const pluginWebhook: ParsedQuery = queryString.parse(queryString.extract(req.url));
    console.log('data webhook', pluginWebhook);

    let callResponse: AppCallResponse;

    try {
        const mattermostOptions: MattermostOptions = {
            accessToken: null,
            mattermostUrl: <string>pluginWebhook.mattermostUrl
        }
        const mattermostClient: MattermostClient = new MattermostClient(mattermostOptions);
        
        await mattermostClient.createWebhook(<string>pluginWebhook.secret, <string>pluginWebhook.channelId, req.body);

        callResponse = newOKCallResponse();
        res.json(callResponse);
    } catch (error: any) {
        callResponse = newErrorCallResponseWithMessage('Error webhook: ' + error.message);
        res.json(callResponse);
    }
}
