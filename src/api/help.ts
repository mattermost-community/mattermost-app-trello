import {Request, Response} from 'express';
import manifest from '../manifest.json';
import {
    isUserSystemAdmin, 
    newOKCallResponseWithMarkdown
} from "../utils";
import {AppCallRequest, AppCallResponse, ExpandedBotActingUser} from "../types";
import {addBulletSlashCommand, h5, joinLines} from "../utils/markdown";
import {Commands} from "../constant";

export const getHelp = async (request: Request, response: Response) => {
    const helpText = [
        getHeader(),
        getCommands(request.body)
    ].join('');
    const callResponse: AppCallResponse = newOKCallResponseWithMarkdown(helpText);

    response.json(callResponse);
};

function getHeader(): string {
    return h5(`Mattermost Trello Plugin - Slash Command Help`);
}

function getCommands(call: AppCallRequest): string {
    const context = call.context as ExpandedBotActingUser;
    
    return isUserSystemAdmin(context.acting_user)
        ? getAdminCommands()
        : getUserCommands();
}

function getUserCommands(): string {
    const homepageUrl: string = manifest.homepage_url;

    return `${joinLines(
        addBulletSlashCommand(Commands.HELP, `Launch the Jira plugin command line help syntax, check out the [documentation](${homepageUrl}).`),
        addBulletSlashCommand(Commands.CARD, `Create a new card`),
        addBulletSlashCommand(Commands.SUBSCRIPTION, 'Subscribe channel to receive Trello notifications'),
        addBulletSlashCommand(Commands.ACCOUNT, 'log in and out with trello'),
    )}\n`;
}

function getAdminCommands(): string {
    const homepageUrl: string = manifest.homepage_url;

    return `${joinLines(
        addBulletSlashCommand(Commands.HELP, `Launch the Jira plugin command line help syntax, check out the [documentation](${homepageUrl}).`),
        addBulletSlashCommand(Commands.CONFIGURE, `Configure Trello workspace`),
    )}\n`;
}
