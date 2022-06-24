import {Request, Response} from 'express';
import {AppCallResponse, AppCallRequest} from '../types';
import {newOKCallResponseWithMarkdown} from '../utils';
import {MattermostClient, MattermostOptions} from '../clients/mattermost';
import manifest from '../manifest.json';

export const getInstall = async (request: Request, response: Response) => {
    const call: AppCallRequest = request.body;
    const mattermostUrl: string | undefined = call.context.mattermost_site_url;
    const botAccessToken: string | undefined = call.context.acting_user_access_token;
    const userId: string | undefined = call.context.bot_user_id;

    const mattermostOpts: MattermostOptions = {
        mattermostUrl: <string>mattermostUrl,
        accessToken: <string>botAccessToken
    };
    const mattermostClient: MattermostClient = new MattermostClient(mattermostOpts);

    await mattermostClient.updateRolesByUser(<string>userId, 'system_user system_post_all');

    const helpText: string = [
        getCommands()
    ].join('');
    const callResponse: AppCallResponse = newOKCallResponseWithMarkdown(helpText);

    response.json(callResponse);
};

function getCommands(): string {
    const homepageUrl: string = manifest.homepage_url;
    return `${joinLines(
        `To finish configuring the Trello app please read the [Quick Start](${homepageUrl}#quick-start) section of the README`
    )}\n`;
}

function joinLines(...lines: string[]): string {
    return lines.join('\n');
}
