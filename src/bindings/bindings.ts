import {AppExpandLevels, TrelloIcon, Routes, Commands, AppFieldTypes} from '../constant';
import { getManifestData } from '../api/manifest';
import {AppBinding} from "../types";
import {SubscriptionCreateForm} from "../constant/forms";

export const getHelpBinding = (): any => {
    return {
        icon: TrelloIcon,
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

export const getCardBinding = (): any => {
    return {
        icon: TrelloIcon,
        label: Commands.CARD,
        description: 'Add a new Card To Board',
        hint: `[${Commands.NEW} | ${Commands.ADD}]`,
        bindings: [
            getAddBinding(),
            getNewBinding(),
        ]
    }
}

export const getAddBinding = (): any => {
    return {
        icon: TrelloIcon,
        label: Commands.ADD,
        description: 'Add a new Card To Board',
        form: {
            title: 'Add a new Card to Board',
            icon: TrelloIcon,
            submit: {
                path: Routes.App.BindingPathAdd,
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
}

export const getNewBinding = (): any => {
    return {
        icon: TrelloIcon,
        label: Commands.NEW,
        description: 'Add a new Card To Board',
        hint: '[form]',
        form: {
            title: 'Add a new Card to Board',
            icon: TrelloIcon,
            submit: {
                path: Routes.App.BindingPathAdd,
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
    }
}

export const getSubscriptionBinding = (): any => {
    const subCommands: string[] = [
        Commands.ADD,
        Commands.LIST,
        Commands.REMOVE
    ];

    const bindings: AppBinding[] = [
        getAddSubBinding(),
        getListSubBinding(),
        getRemoveSubBinding()
    ];

    return {
        icon: TrelloIcon,
        label: Commands.SUBSCRIPTION,
        description: 'Subscribe current channel to a Trello board',
        hint: `[${subCommands.join(' | ')}]`,
        bindings: bindings
    }
}

export const getAddSubBinding = (): any => {
    return {
        icon: TrelloIcon,
        label: Commands.ADD,
        description: 'Subscribe current channel to a Trello board',
        form: {
            title: 'Subscribe channel to Trello board',
            icon: TrelloIcon,
            submit: {
                path: Routes.App.CallSubscriptionAdd,
                expand: {
                    app: AppExpandLevels.EXPAND_SUMMARY,
                    channel: AppExpandLevels.EXPAND_ALL,
                    admin_access_token: AppExpandLevels.EXPAND_ALL,
                    user: AppExpandLevels.EXPAND_SUMMARY,
                },
            },
            fields: [
                {
                    modal_label: 'Board name',
                    name: SubscriptionCreateForm.BOARD_NAME,
                    type: AppFieldTypes.TEXT,
                    is_required: true,
                    position: 1,
                    max_length: 100
                },
                {
                    modal_label: 'Channel',
                    name: SubscriptionCreateForm.CHANNEL_ID,
                    type: AppFieldTypes.CHANNEL,
                    is_required: true,
                    position: 2
                }
            ]
        }
    }
}

export const  getListSubBinding = (): any => {
    return {
        icon: TrelloIcon,
        label: Commands.LIST,
        description: 'Get list of Trello boards subscribed to current channel',
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

export const  getRemoveSubBinding = (): any => {
    return {
        icon: TrelloIcon,
        label: Commands.REMOVE,
        description: 'Remove subscription from current channel',
        form: {
            title: 'This is a form',
            icon: TrelloIcon,
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
