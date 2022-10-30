import {AppActingUser, AppBinding, AppCallRequest, AppsState} from '../types';
import {
    getHelpBinding,
    getSubscriptionBinding,
    getConfigureBinding,
    getCardBinding,
    getAccountConnectBinding,
    getAccountDisconnectBinding
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
import { AppContext } from '../types/apps';
import { configureI18n } from '../utils/translations';

const newCommandBindings = (context: AppContext, bindings: AppBinding[], commands: string[]): AppsState => {
    const i18nObj = configureI18n(context);

    return {
        location: AppBindingLocations.COMMAND,
        bindings: [
            {
                icon: TrelloIcon,
                label: CommandTrigger,
                hint: `[${commands.join(' | ')}]`,
                description: i18nObj.__('binding.bindings-descriptions.bindings'),
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
    const context = call.context as AppContext;

    const options: KVStoreOptions = {
        mattermostUrl: <string>mattermostUrl,
        accessToken: <string>botAccessToken,
    };
    const kvClient = new KVStoreClient(options);
    
    const bindings: AppBinding[] = [];
    const commands: string[] = [
        Commands.HELP
    ];

    bindings.push(getHelpBinding(context));

    if (isUserSystemAdmin(<AppActingUser>actingUser)) {
        bindings.push(getConfigureBinding(context));
        commands.push(Commands.CONFIGURE);
    }  
    if (await existsKvTrelloConfig(kvClient)) {
        if (await existsKvOauthToken(kvClient, <string>actingUserID)) {
            commands.push(Commands.CARD);
            commands.push(Commands.SUBSCRIPTION);
            bindings.push(getCardBinding(context));
            bindings.push(getSubscriptionBinding(context));
        }

        commands.push(Commands.CONNECT);
        commands.push(Commands.DISCONNECT);
        bindings.push(getAccountConnectBinding(context));
        bindings.push(getAccountDisconnectBinding(context));
    }

    return newCommandBindings(context, bindings, commands);
};

