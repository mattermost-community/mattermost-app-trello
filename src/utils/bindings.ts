import {AppBinding} from '../types';
import {AppBindingLocations, CommandTrigger, TrelloIcon} from '../constant';
import manifest from '../manifest.json';

export const newCommandBindings = (bindings: AppBinding[]): AppBinding => {
    return {
        app_id: manifest.app_id,
        label: CommandTrigger,
        location: AppBindingLocations.COMMAND,
        bindings: [
            {
                app_id: manifest.app_id,
                icon: TrelloIcon,
                label: CommandTrigger,
                description: 'Manage Trello tickets',
                hint: '',
                bindings,
            },
        ],
    };
};
