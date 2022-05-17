import {Request, Response} from 'express';
import manifest from '../manifest.json';
import {CommandTrigger} from '../constant';
import {newOKCallResponseWithMarkdown} from "../utils/call-responses";
import {AppCallResponse} from "../types";

export const getHelp = async (request: Request, response: Response) => {
    console.log('hello help')
    const helpText = [
        getHeader(),
        getCommands(),
        getPostText(),
    ].join('');
    const callResponse: AppCallResponse = newOKCallResponseWithMarkdown(helpText);

    //response.json(callResponse);
    response.json({
        Type: 'ok',
        Text: 'testing response'
    });
};

function getHeader(): string {
    const homepageURL = manifest.homepage_url;
    return h4(`Trello [(GitHub Link)](${homepageURL})`);
}

function getCommands(): string {
    let text = getUserCommands();
    return text;
}

function getUserCommands(): string {
    return `${joinLines(
        h5('User Commands'),
        addBulletSlashCommand('help'),
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

function addBulletSlashCommand(text: string): string {
    return `* \`/${CommandTrigger} ${text}\``;
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
