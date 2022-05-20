import {Request, Response} from 'express';
import manifest from '../manifest.json';
import {CommandTrigger} from '../constant';
import {newOKCallResponseWithMarkdown} from "../utils/call-responses";
import {AppCallResponse} from "../types";

export const getHelp = async (request: Request, response: Response) => {
    console.log('hello help')
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
        addBulletSlashCommand('add', `Create a new Trello Card on a board`),
        addBulletSlashCommand('new', `Create a new Trello Card on a board`),
    )}\n`;
}

function getPostText(): string {
    return `${joinLines(
        h5('Post Menu Options'),
        textLine('click the (...) on a post'),
        addBullet('Create Trello Incidence'),
    )}\n`;
}

function addBullet(text: string): string {
    return `* ${text}`;
}

function addBulletSlashCommand(text: string, description: string): string {
    return `* \`/${CommandTrigger} ${text}\` - ${description}`;
}

function h5(text: string): string {
    return `##### ${text}\n`;
}

function h4(text: string): string {
    return `#### ${text}\n`;
}

function textLine(text: string): string {
    return `${text}\n`;
}

function joinLines(...lines: string[]): string {
    return lines.join('\n');
}
