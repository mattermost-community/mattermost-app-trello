import {AppBinding, AppsState} from '../types';

import {getHelpBinding, getSubscriptionBinding, getConfigureBinding, getCardBinding, getAccountBinding } from './bindings';
import {AppBindingLocations, Commands, CommandTrigger, TrelloIcon} from "../constant";

const newCommandBindings = (bindings: AppBinding[]): AppsState => {
    const commands: string[] = [
        Commands.HELP,
        Commands.CARD,
        Commands.SUBSCRIPTION,
        Commands.CONFIGURE,
        Commands.ACCOUNT
    ];

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

export const getCommandBindings = (): AppsState => {
    const bindings: AppBinding[] = [];

    bindings.push(getHelpBinding());
    bindings.push(getCardBinding());
    bindings.push(getSubscriptionBinding());
    bindings.push(getConfigureBinding());
    bindings.push(getAccountBinding());
    return newCommandBindings(bindings);
};

