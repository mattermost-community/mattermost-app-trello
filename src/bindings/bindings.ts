import {AppExpandLevels, TrelloIcon, Routes, Commands} from '../constant';

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
        hint: `[${Commands.CREATE}]`,
        bindings: [
            getCardCreateBinding(),
        ]
    }
}

export const getCardCreateBinding = (): any => {
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

export const getSubscriptionBinding = (): any => {
    return {
        icon: TrelloIcon,
        label: Commands.SUBSCRIPTION,
        description: 'Link current channel to a trello workspace',
        hint: `[${Commands.ADD} | ${Commands.LIST} | ${Commands.REMOVE}]`,
        bindings: [
            getAddSubBinding(),
            getListBinding(),
            getRemoveBinding()
        ]
    }
}

export const  getAddSubBinding = (): any => {
    return {
        icon: TrelloIcon,
        label: Commands.ADD,
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

export const  getListBinding = (): any => {
    return {
        icon: TrelloIcon,
        label: Commands.LIST,
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

export const  getRemoveBinding = (): any => {
    return {
        icon: TrelloIcon,
        label: Commands.REMOVE,
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

export const getAccountBinding = (): any => {
    return {
        icon: TrelloIcon,
        label: Commands.ACCOUNT,
        description: 'Add a new Card To Board',
        hint: `[${Commands.LOGIN}]`,
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

export const getAccountLogoutBinding = (): any => {
    return {
        icon: TrelloIcon,
        label: Commands.LOGOUT,
        description: 'Remove your Trello credentials',
        form: {
            title: 'Remove your Trello credentials',
            icon: TrelloIcon,
            submit: {
                path: `${Routes.App.Forms}${Routes.App.BindingPathCreateCard}`,
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
