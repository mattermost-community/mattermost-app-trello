import {AppExpandLevels, TrelloIcon, Routes, Commands, AppFieldTypes} from '../constant';
import {AppBinding, AppContext} from '../types';
import {SubscriptionCreateForm, SubscriptionRemoveForm} from "../constant/forms";

export const getHelpBinding = (context: AppContext): any => {
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
                    acting_user: AppExpandLevels.EXPAND_ALL
                }
            }
        }
    };
};

export const getCardBinding = (context: AppContext) => {
    const commands: string[] = [
        Commands.CREATE
    ];

    return {
        icon: TrelloIcon,
        label: Commands.CARD,
        description: 'Add a new Card To Board',
        hint: `[${commands.join(' | ')}]`,
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

export const getSubscriptionBinding = (context: AppContext): any => {
    const subCommands: string[] = [
        Commands.ADD,
        Commands.LIST,
        Commands.REMOVE
    ];

    const bindings: AppBinding[] = [
        getAddSubBinding(context),
        getListSubBinding(context),
        getRemoveSubBinding(context)
    ];

    return {
        icon: TrelloIcon,
        label: Commands.SUBSCRIPTION,
        description: 'Subscribe current channel to a Trello board',
        hint: `[${subCommands.join(' | ')}]`,
        bindings: bindings
    }
}

export const getAddSubBinding = (context: AppContext): any => {
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

export const  getListSubBinding = (context: AppContext): any => {
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

export const getRemoveSubBinding = (context: AppContext): any => {
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

export const getConfigureBinding = (context: AppContext): any => {
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


export const getAccountConnectBinding = (context: AppContext): any => {
    return {
        icon: TrelloIcon,
        label: Commands.CONNECT,
        description: 'Configure your Trello credentials',
        form: {
            title: 'Configure your Trello credentials',
            icon: TrelloIcon,
            submit: {
                path: `${Routes.App.BindingPathConnect}`,
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

export const getAccountDisconnectBinding = (context: AppContext): any => {
    return {
        icon: TrelloIcon,
        label: Commands.DISCONNECT,
        description: 'Remove your Trello credentials',
        form: {
            title: 'Remove your Trello credentials',
            icon: TrelloIcon,
            submit: {
                path: `${Routes.App.BindingPathDisconnect}`,
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
