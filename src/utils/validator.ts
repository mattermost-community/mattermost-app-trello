import { z } from 'zod';

export const AddForm = z.object({
    title: z.string(),
    header: z.string(),
    icon: z.string(),
    fields: z.tuple([
        z.object({
            type: z.string(),
            name: z.string(),
            modal_label: z.string(),
            value: z.string(),
            description: z.string(),
            is_required: z.boolean(),
        }),
        z.object({
            name: z.string(),
            modal_label: z.string(),
            refresh: z.boolean(),
            value: z.string(),
            type: z.string(),
            options: z.tuple([
                z.object({
                    label: z.string(),
                    value: z.string(),
                    icon_data: z.string().optional(),
                }),
            ]).optional(),
            is_required: z.boolean(),
        }),
    ]),
    submit_label: z.string(),
    submit: z.object({
        path: z.string(),
        expand: z.object({
            acting_user: z.string(),
            acting_user_access_token: z.string(),
            oauth2_app: z.string(),
            oauth2_user: z.string(),
        }),
    }),
    source: z.object({
        path: z.string(),
        expand: z.object({
            acting_user: z.string(),
            acting_user_access_token: z.string(),
            oauth2_app: z.string(),
            oauth2_user: z.string(),
        }),
    }),
});

export const ConnectFormValidator = z.object({
    title: z.string(),
    header: z.string(),
    icon: z.string(),
    fields: z.tuple([
        z.object({
            type: z.string(),
            name: z.string(),
            modal_label: z.string(),
            value: z.string(),
            hint: z.string(),
            description: z.string(),
            is_required: z.boolean(),
        }),
    ]).optional(),
    submit: z.object({
        path: z.string(),
        expand: z.object({
            acting_user: z.string(),
            acting_user_access_token: z.string(),
            oauth2_app: z.string(),
            oauth2_user: z.string(),
        }),
    }),
});

export const WebhookCreation = z.object({
    description: z.string(),
    idModel: z.string(),
    callbackURL: z.string(),
});

export const TrelloOptionsForm = z.object({ apiKey: z.string(), token: z.string() });

export const ConfigForm = z.object({
    title: z.string(),
    header: z.string(),
    icon: z.string(),
    fields: z.tuple([
        z.object({
            type: z.string(),
            name: z.string(),
            label: z.string(),
            value: z.string(),
            hint: z.string().optional(),
            description: z.string(),
            is_required: z.boolean(),
        }),
        z.object({
            type: z.string(),
            name: z.string(),
            modal_label: z.string(),
            value: z.string(),
            description: z.string(),
            is_required: z.boolean(),
        }),
        z.object({
            type: z.string(),
            subtype: z.string().optional(),
            name: z.string(),
            modal_label: z.string(),
            value: z.string(),
            description: z.string(),
            is_required: z.boolean(),
        }),
    ]).optional(),
    submit: z.object({
        path: z.string(),
        expand: z.object({
            acting_user: z.string(),
            acting_user_access_token: z.string(),
            oauth2_app: z.string(),
            oauth2_user: z.string(),
        }),
    }),
});

export const Oauth2AppAuth = z.object({
    client_id: z.string(),
    client_secret: z.string(),
    data: z.object({ workspace: z.string() }).optional(),
});