import {AppBinding, AppsState} from '../types';

import {getHelpBinding, getSubscriptionBinding, getConfigureBinding, getCardBinding } from './bindings';
import {AppBindingLocations, Commands, CommandTrigger, TrelloIcon} from "../constant";

const newCommandBindings = (bindings: AppBinding[]): AppsState => {
    const commands: string[] = [
        Commands.HELP,
        Commands.CARD,
        Commands.SUBSCRIPTION,
        Commands.CONFIGURE
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

export const getCommandBindings = async (context: any): Promise<AppsState> => {
    const bindings: AppBinding[] = [];
    bindings.push(getHelpBinding());
    bindings.push(getCardBinding());
    bindings.push(getConfigureBinding());
    bindings.push(await getSubscriptionBinding(context));
    return newCommandBindings(bindings);
};

