import {Request, Response} from 'express';
import manifest from '../manifest.json';
import {newOKCallResponseWithMarkdown} from "../utils";
import {AppCallResponse} from "../types";
import {addBulletSlashCommand, h5, joinLines} from "../utils/markdown";
import { Commands } from '../constant';

export const getHelp = async (request: Request, response: Response) => {
    const helpText = [
        getHeader(),
        getCommands()
    ].join('');
    const callResponse: AppCallResponse = newOKCallResponseWithMarkdown(helpText);

    response.json(callResponse);
};

function getHeader(): string {
    return h5(`Mattermost Trello Plugin - Slash Command Help`);
}

function getCommands(): string {
    let text = getUserCommands();
    return text;
}

function getUserCommands(): string {
    const homepageUrl: string = manifest.homepage_url;
    return `${joinLines(
        addBulletSlashCommand('help', `Launch the Jira plugin command line help syntax, check out the [documentation](${homepageUrl}).`),
        addBulletSlashCommand(Commands.CARD, `Create a new card`), 
        addBulletSlashCommand(Commands.CONFIGURE, `Configure Trello workspace`),
        addBulletSlashCommand(Commands.SUBSCRIPTION, 'Subscribe channel to receive Trello notifications',),
    )}\n`;
}
