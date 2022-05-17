import {AppBinding} from '../types';
import {AppBindingLocations, CommandTrigger, TrelloIcon, Commands} from '../constant';
import manifest from '../manifest.json';

export const newCommandBindings = (bindings: AppBinding[]): any => {
    return {
        location: AppBindingLocations.COMMAND,
        bindings: [
            {
                icon: TrelloIcon,
                label: CommandTrigger,
                hint: `[${Commands.HELP} | ${Commands.ADD} | ${Commands.NEW}]`,
                bindings,
            },
        ],
    };
};
