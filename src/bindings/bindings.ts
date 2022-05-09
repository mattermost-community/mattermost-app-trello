import {AppBinding} from '../types';
import manifest from '../manifest.json';
import {AppExpandLevels, Locations, TrelloIcon, Routes} from '../constant';

export const getHelpBinding = (): AppBinding => {
    return {
        app_id: manifest.app_id,
        location: Locations.Help,
        label: 'help',
        description: 'Show Trello Help',
        icon: TrelloIcon,
        form: {fields: []},
        call: {
            path: Routes.App.BindingPathHelp,
            expand: {
                acting_user: AppExpandLevels.EXPAND_SUMMARY,
            },
        },
    };
};
