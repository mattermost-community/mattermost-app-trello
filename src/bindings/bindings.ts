import {AppExpandLevels, TrelloIcon, Routes, Commands, AppFieldTypes} from '../constant';
import { AppBinding, AppContext, AppSelectOption } from '../types/apps';
import {SubscriptionCreateForm, SubscriptionRemoveForm} from "../constant/forms";
import { ConfigStoreProps, KVStoreClient, KVStoreOptions } from '../clients/kvstore';
import { tryGetTrelloConfig, tryGetUserOauthToken } from '../utils';

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

export const getCardBinding = () => {
    return {
        icon: TrelloIcon,
        label: Commands.CARD,
        description: 'Add a new Card To Board',
        hint: `[${Commands.CREATE}]`,
        bindings: [
            getCardCreateBinding(),
        ]
    }
}

export const getCardCreateBinding = () => {
    return {
        icon: TrelloIcon,
        label: Commands.CREATE,
        description: 'Add a new Card To Board',
        form: {
            title: 'Add a new Card to Board',
            icon: TrelloIcon,
            submit: {
                path: `${Routes.App.Forms}${Routes.App.BindingPathCreateCard}`,
                expand: {
                    acting_user: AppExpandLevels.EXPAND_ALL,
                    acting_user_access_token:  AppExpandLevels.EXPAND_ALL,
                    channel: AppExpandLevels.EXPAND_ALL,
                    user: AppExpandLevels.EXPAND_ALL,
                    oauth2_app: AppExpandLevels.EXPAND_ALL,
                    oauth2_user: AppExpandLevels.EXPAND_ALL,
                }
            },
            fields: [
                {
                    type: AppFieldTypes.TEXT,
                    name: 'card_name',
                    modal_label: 'Card Name',
                    description: 'Name of the card',
                },
                {
                    type: AppFieldTypes.TEXT,
                    name: 'board_name',
                    modal_label: 'Board Name',
                    description: 'Name of the board',
                },
                {
                    type: AppFieldTypes.TEXT,
                    name: 'list_name',
                    modal_label: 'List Name',
                    description: 'Name of the list',
                },
            ]
        }
    };
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
            submit: {
                path: Routes.App.CallSubscriptionList,
                expand: {
                    app: AppExpandLevels.EXPAND_ALL,
                    acting_user: AppExpandLevels.EXPAND_ALL,
                    acting_user_access_token:  AppExpandLevels.EXPAND_ALL,
                }
            }
        },
    }
}

export const getRemoveSubBinding = (): any => {
    
    return {
        icon: TrelloIcon,
        label: Commands.REMOVE,
        description: 'Remove subscription from current channel',
        form: {
            title: 'Unsubscribe from Trello board notifications',
            icon: TrelloIcon,
            submit: {
                path: Routes.App.CallSubscriptionRemove,
                expand: {
                    app: AppExpandLevels.EXPAND_SUMMARY,
                    channel: AppExpandLevels.EXPAND_ALL,
                    admin_access_token: AppExpandLevels.EXPAND_ALL,
                    user: AppExpandLevels.EXPAND_SUMMARY,
                },
                call: {
                    path: Routes.App.CallSubscriptionListAppOpts
                }
            },
            fields: [
                {
                    modal_label: 'Subscription ID',
                    name: SubscriptionRemoveForm.SUBSCRIPTION,
                    type: AppFieldTypes.TEXT,
                    is_required: true,
                    position: 1,
                    max_length: 100
                },
            ]
        }
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

export const getAccountBinding = (): any => {
    return {
        icon: TrelloIcon,
        label: Commands.ACCOUNT,
        description: 'Configure your trello account',
        hint: `[${Commands.LOGIN} | ${Commands.LOGOUT}]`,
        bindings: [
            getAccountLoginBinding(),
            getAccountLogoutBinding()
        ]
    }
}

export const getAccountLoginBinding = (): any => {
    return {
        icon: TrelloIcon,
        label: Commands.LOGIN,
        description: 'Configure your Trello credentials',
        form: {
            title: 'Configure your Trello credentials',
            icon: TrelloIcon,
            submit: {
                path: `${Routes.App.BindingPathLogin}`,
                expand: {
                    acting_user: AppExpandLevels.EXPAND_ALL,
                    acting_user_access_token:  AppExpandLevels.EXPAND_ALL,
                    channel: AppExpandLevels.EXPAND_ALL,
                    user: AppExpandLevels.EXPAND_ALL,
                    oauth2_app: AppExpandLevels.EXPAND_ALL,
                    oauth2_user: AppExpandLevels.EXPAND_ALL,
                }
            }
        }
    };
}

export const getAccountLogoutBinding = (): any => {
    return {
        icon: TrelloIcon,
        label: Commands.LOGOUT,
        description: 'Remove your Trello credentials',
        form: {
            title: 'Remove your Trello credentials',
            icon: TrelloIcon,
            submit: {
                path: `${Routes.App.BindingPathLogout}`,
                expand: {
                    acting_user: AppExpandLevels.EXPAND_ALL,
                    acting_user_access_token:  AppExpandLevels.EXPAND_ALL,
                    channel: AppExpandLevels.EXPAND_ALL,
                    user: AppExpandLevels.EXPAND_ALL,
                    oauth2_app: AppExpandLevels.EXPAND_ALL,
                    oauth2_user: AppExpandLevels.EXPAND_ALL,
                }
            }
        }
    };
}
