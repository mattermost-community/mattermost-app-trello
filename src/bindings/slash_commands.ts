import {AppActingUser, AppBinding, AppCallRequest, AppsState} from '../types';
import {
    getHelpBinding,
    getSubscriptionBinding,
    getConfigureBinding,
    getCardBinding,
    getAccountBinding
} from "./bindings";
import {
    AppBindingLocations,
    Commands,
    CommandTrigger,
    TrelloIcon
} from "../constant";
import {
    KVStoreClient, 
    KVStoreOptions, 
} from '../clients/kvstore';
import {existsKvOauthToken, existsKvTrelloConfig, isUserSystemAdmin} from "../utils";

const newCommandBindings = (bindings: AppBinding[], commands: string[]): AppsState => {
    return {
        location: AppBindingLocations.COMMAND,
        bindings: [
            {
                icon: TrelloIcon,
                label: CommandTrigger,
                hint: `[${commands.join(' | ')}]`,
                bindings,
            },
        ],
    };
};

export const getCommandBindings = async (call: AppCallRequest): Promise<AppsState> => {
    const mattermostUrl: string | undefined = call.context.mattermost_site_url;
    const botAccessToken: string | undefined = call.context.bot_access_token;
    const actingUser: AppActingUser | undefined = call.context.acting_user;
    const actingUserID: string | undefined = call.context.acting_user?.id; 

    const options: KVStoreOptions = {
        mattermostUrl: <string>mattermostUrl,
        accessToken: <string>botAccessToken,
    };
    const kvClient = new KVStoreClient(options);
    
    const bindings: AppBinding[] = [];
    const commands: string[] = [
        Commands.HELP
    ];

    bindings.push(getHelpBinding());

    if (isUserSystemAdmin(<AppActingUser>actingUser)) {
        bindings.push(getConfigureBinding());
        commands.push(Commands.CONFIGURE);
    }  
    if (await existsKvTrelloConfig(kvClient)) {
        if (await existsKvOauthToken(kvClient, <string>actingUserID)) {
            commands.push(Commands.CARD);
            commands.push(Commands.SUBSCRIPTION);
            bindings.push(getCardBinding());
            bindings.push(getSubscriptionBinding());
        }

        commands.push(Commands.ACCOUNT);
        bindings.push(getAccountBinding());
    }

    return newCommandBindings(bindings, commands);
};

