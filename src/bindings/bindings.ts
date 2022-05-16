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
        form: {title: 'title', submit_buttons: 'test', fields: []},
        call: {
            path: Routes.App.BindingPathHelp,
            expand: {
                acting_user: AppExpandLevels.EXPAND_SUMMARY,
            },
        },
    };
};

export const getAddBinding = (): AppBinding => {
    return {
        app_id: manifest.app_id,
        location: Locations.Help,
        label: 'add',
        description: 'Add a new Card To Board',
        icon: TrelloIcon,
        form: {title: 'title', submit_buttons: 'test', fields: []},
        call: {
            path: Routes.App.BindingPathAdd,
            expand: {
                acting_user: AppExpandLevels.EXPAND_SUMMARY,
            },
        },
    };
}

export const getNewBinding = (): AppBinding => {
    return {
        app_id: manifest.app_id,
        location: Locations.Help,
        label: 'add',
        description: 'Add a new Card To Board',
        icon: TrelloIcon,
        form: {title: 'title', submit_buttons: 'test', fields: []},
        call: {
            path: Routes.App.BindingPathAdd,
            expand: {
                acting_user: AppExpandLevels.EXPAND_SUMMARY,
            },
        },
    };
}