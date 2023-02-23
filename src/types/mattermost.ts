export type User = {
    id: string;
    create_at: number;
    update_at: number;
    delete_at: number;
    username: string;
    auth_data: string;
    auth_service: string;
    email: string;
    nickname: string;
    first_name: string;
    last_name: string;
    position: string;
    roles: string;
    last_picture_update: number;
    locale: string;
    timezone: {
        automaticTimezone: string;
        manualTimezone: string;
        useAutomaticTimezone: string;
    };
    is_bot: boolean;
    bot_description: string;
    disable_welcome_email: false;
};

export type UserNotifyProps = {
    channel: string;
    comments: string;
    desktop: string;
    desktop_sound: string;
    desktop_threads: string;
    email: string;
    email_thread: string;
    first_name: string;
    mention_keys: string;
    push: string;
    push_status: string;
    push_threads: string;
}

export type UserTimezone = {
    useAutomaticTimezone: boolean | string;
    automaticTimezone: string;
    manualTimezone: string;
};

export type UserProfile = {
    id: string;
    create_at: number;
    update_at: number;
    delete_at: number;
    username: string;
    auth_data: string;
    auth_service: string;
    email: string;
    nickname: string;
    first_name: string;
    last_name: string;
    position: string;
    roles: string;
    allow_marketing: boolean;
    notify_props: UserNotifyProps;
    last_password_update: number;
    locale: string;
    timezone?: UserTimezone;
}

export type AttachmentOption = {
    text: string;
    value: string;
};

export type AttachmentAction = {
    id: string;
    name: string;
    type: string;
    style?: string;
    data_source?: string;
    integration: {
        url: string;
        context: any;
    };
    options?: AttachmentOption[];
}

export type Attachment = {
    text?: string;
    title?: string;
    title_link?: string;
    author_name?: string;
    author_icon?: string;
    fields?: {
        short: boolean;
        title: string;
        value: string;
    }[];
    actions?: AttachmentAction[]
};

export type PostCreate = {
    channel_id: string;
    message: string;
    root_id?: string;
    file_ids?: string[];
    props?: {
        attachments: Attachment[];
    }
}

export type PostUpdate = {
    id: string;
    is_pinned?: boolean;
    message?: string;
    has_reactions?: boolean;
    props?: {
        attachments: Attachment[];
    }
}

export type IncomingWebhook = {
    id: string,
    create_at: number,
    update_at: number,
    delete_at: number,
    user_id: string,
    channel_id: string,
    team_id: string,
    display_name: string,
    description: string,
    username: string,
    icon_url: string,
    channel_locked: boolean
}
