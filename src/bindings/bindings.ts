import {AppBinding} from '../types';
import manifest from '../manifest.json';
import {AppExpandLevels, Locations, TrelloIcon, Routes, Commands} from '../constant';

export const getHelpBinding = (): any => {
    return {
        label: Commands.HELP,
        description: 'Show Trello Help',
        form: {
            title: "Show Trello Help Title",
            icon: TrelloIcon,
            submit: {
                path: Routes.App.BindingPathHelp,
                expand: {
                    app: AppExpandLevels.EXPAND_ALL,
                    acting_user: AppExpandLevels.EXPAND_ALL,
                    acting_user_access_token:  AppExpandLevels.EXPAND_ALL,
                    admin_access_token: AppExpandLevels.EXPAND_ALL,
                    channel: AppExpandLevels.EXPAND_ALL,
                    post: AppExpandLevels.EXPAND_ALL,
                    root_post: AppExpandLevels.EXPAND_ALL,
                    team: AppExpandLevels.EXPAND_ALL,
                    user: AppExpandLevels.EXPAND_ALL,
                    oauth2_app: AppExpandLevels.EXPAND_ALL,
                    oauth2_user: AppExpandLevels.EXPAND_ALL,
                    locale: AppExpandLevels.EXPAND_ALL
                }
            }
        }
    };
};

export const getAddBinding = (): any => {
    return {
        label: Commands.ADD,
        description: 'Add a new Card To Board',
        form: {
            title: 'Add a new Card to Board',
            icon: TrelloIcon,
            submit: {
                path: Routes.App.BindingPathAdd,
                expand: {
                    acting_user_access_token: AppExpandLevels.EXPAND_ALL
                }
            }
        }
    };
    /*return {
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
    };*/
}

export const getNewBinding = (): any => {
    return {
        label: Commands.NEW,
        description: 'Add a new Card To Board',
        form: {
            title: 'Add a new Card to Board',
            icon: TrelloIcon,
            submit: {
                path: Routes.App.BindingPathNew,
                expand: {
                    acting_user_access_token: AppExpandLevels.EXPAND_ALL
                }
            }
        }
    };
}