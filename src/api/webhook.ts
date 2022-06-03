import {Request, Response} from "express";
import {AppCallResponse, AppContext, PostCreate} from "../types";
import {newErrorCallResponseWithMessage, newOKCallResponse} from "../utils";
import {h5} from "../utils/markdown";
import {TrelloAction, TrelloModel, TrelloWebhookResponse} from "../types/trello";
import {MattermostClient, MattermostOptions} from "../clients/mattermost";

async function notifyCardMoved(event: TrelloWebhookResponse, context: AppContext) {
    const mattermostUrl: string | undefined = context.mattermost_site_url;
    const botAccessToken: string | undefined = context.bot_access_token;
    const action: TrelloAction = event.action;
    const cardModel: TrelloModel = event.model;

    const payload: PostCreate = {
        message: h5(`Card moved "${action.data.card.name}"  ("${action.data.board.name}" Board)`),
        channel_id: '',
        props: {
            attachments: [
                {
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
        channel_id: '',
        props: {
            attachments: [
                {
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
    console.log('request', request.body);
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
