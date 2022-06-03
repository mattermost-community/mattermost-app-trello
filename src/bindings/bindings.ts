import {AppExpandLevels, TrelloIcon, Routes, Commands, AppFieldTypes} from '../constant';
import { getManifestData } from '../api/manifest';
import { subscriptionRemoveForm } from '../forms/subscription-remove';
import { AppCallRequest } from '../types';
import { AppContext } from '../types/apps';

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

export const getSubscriptionBinding = async (context: AppContext): Promise<any> => {
    return {
        icon: TrelloIcon,
        label: Commands.SUBSCRIPTION,
        description: 'Subscribe current channel to a Trello board',
        hint: `[${Commands.ADD} | ${Commands.LIST} | ${Commands.REMOVE}]`,
        bindings: [
            getAddSubBinding(),
            getListSubBinding(),
            await getRemoveSubBinding(context)
        ]
    }
}

export const getAddSubBinding = (): any => {
    return {
        app_id: getManifestData().app_id,
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
            }
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

export const getRemoveSubBinding = async (context: AppContext): Promise<any> => {
    const form = await subscriptionRemoveForm(context);
    
    return {
        icon: TrelloIcon,
        label: Commands.REMOVE,
        description: 'Remove subscription from current channel',
        form: form
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
