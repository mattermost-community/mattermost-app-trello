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
import { existsOauth2App, existsToken, isUserSystemAdmin} from "../utils";
import { AppContext, Oauth2App } from '../types/apps';
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
    const actingUser: AppActingUser | undefined = call.context.acting_user;
    const context = call.context as AppContext;
    const oauth2 = call.context.oauth2 as Oauth2App;

    const bindings: AppBinding[] = [];
    const commands: string[] = [
        Commands.HELP
    ];

    bindings.push(getHelpBinding(context));

    if (isUserSystemAdmin(<AppActingUser>actingUser)) {
        bindings.push(getConfigureBinding(context));
        commands.push(Commands.CONFIGURE);
    }  
    if (existsOauth2App(oauth2)) {
        if (existsToken(oauth2)) {
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

