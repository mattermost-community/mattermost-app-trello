import {Request, Response} from 'express';
import manifest from '../manifest.json';
import {
    existsKvOauthToken,
    existsKvTrelloConfig,
    isUserSystemAdmin, 
    newOKCallResponseWithMarkdown
} from "../utils";
import {AppActingUser, AppCallRequest, AppCallResponse, ExpandedBotActingUser} from "../types";
import {addBulletSlashCommand, h5, joinLines} from "../utils/markdown";
import {Commands} from "../constant";
import { KVStoreClient, KVStoreOptions } from '../clients/kvstore';

export const getHelp = async (request: Request, response: Response) => {
    const helpText = [
        getHeader(),
        await getCommands(request.body)
    ].join('');
    const callResponse: AppCallResponse = newOKCallResponseWithMarkdown(helpText);

    response.json(callResponse);
};

function getHeader(): string {
    return h5(`Mattermost Trello Plugin - Slash Command Help`);
}

async function getCommands(call: AppCallRequest): Promise<string> {
    const homepageUrl: string = manifest.homepage_url;
    const context = call.context as ExpandedBotActingUser;
    const mattermostUrl: string | undefined = context.mattermost_site_url;
    const botAccessToken: string | undefined = context.bot_access_token;
    const actingUser: AppActingUser | undefined = context.acting_user;
    const actingUserID: string | undefined = actingUser.id;
    const commands: string[] = [];

    const options: KVStoreOptions = {
        mattermostUrl: <string>mattermostUrl,
        accessToken: <string>botAccessToken,
    };
    const kvClient = new KVStoreClient(options);
    
    commands.push(addBulletSlashCommand(Commands.HELP, `Launch the Trello plugin command line help syntax, check out the [documentation](${homepageUrl}).`));

    if (isUserSystemAdmin(<AppActingUser>actingUser)) {
        commands.push(addBulletSlashCommand(Commands.CONFIGURE, `Configure Trello workspace`));
    }
    if (await existsKvTrelloConfig(kvClient)) {
        if (await existsKvOauthToken(kvClient, <string>actingUserID)) {
            commands.push(addBulletSlashCommand(`${Commands.CARD} create`, `Create a new card`));
            commands.push(addBulletSlashCommand(`${Commands.SUBSCRIPTION} add`, 'Subscribe channel to receive notifications from a Trello board'));
            commands.push(addBulletSlashCommand(`${Commands.SUBSCRIPTION} list`, 'Show all your current subscriptions'));
            commands.push(addBulletSlashCommand(`${Commands.SUBSCRIPTION} remove`, 'Stop receiving Trello board\'s notifications'));
        }

        commands.push(addBulletSlashCommand(`${Commands.CONNECT}`, 'Log in to your Trello account'));
        commands.push(addBulletSlashCommand(`${Commands.DISCONNECT}`, 'Log out from your Trello account'));
    }

    return `${joinLines(...commands)}`;
}