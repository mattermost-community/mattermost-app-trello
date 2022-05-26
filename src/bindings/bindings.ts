import {AppBinding, AppsState} from '../types';
import manifest from '../manifest.json';
import {AppExpandLevels, Locations, TrelloIcon, Routes, Commands} from '../constant';
import { getManifestData } from '../api/manifest';

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
}

export const getNewBinding = (): any => {
    return {
        icon: TrelloIcon,
        label: Commands.NEW,
        description: 'Add a new Card To Board',
        hint: '[form]',
            form: {
                title: 'This is a form',
                icon: TrelloIcon,
                fields: [
                    {
                        type: 'text',
                        name: 'name',
                        is_required: true,
                        position: 1
                    },
                    {
                        type: 'text',
                        name: 'board',
                        is_required: false,
                        position: 2
                    }
                ],
                submit: {
                    path: Routes.App.BindingPathLink,
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
            },
    }
}

export const getLinkBinding = (): any => {
    return {
        icon: TrelloIcon,
        label: Commands.LINK,
        description: 'Link current channel to a trello workspace',
        hint: '[form]',
            form: {
                title: 'This is a form',
                icon: TrelloIcon,
                fields: [
                    {
                        type: 'text',
                        name: 'workspace',
                        is_required: true,
                        position: 1
                    }
                ],
                submit: {
                    path: Routes.App.BindingPathLink,
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
            },
    }
}

export const getConfigureBinding = (): any => {
    return {
        icon: TrelloIcon,
        label: Commands.CONFIGURE,
        description: 'Configure the installed Trello account',
        form: {
            title: "Show Trello Help Title",
            icon: TrelloIcon,
            submit: {
                path: Routes.App.CallPathConfigOpenForm,
                expand: {
                    app: AppExpandLevels.EXPAND_ALL,
                    acting_user: AppExpandLevels.EXPAND_ALL,
                    acting_user_access_token: AppExpandLevels.EXPAND_ALL,
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
    }
};