import { z } from 'zod';

export const AppFormFieldValidator = z.object({
    name: z.string(),
    type: z.string(),
    is_required: z.boolean().optional(),
    readonly: z.boolean().optional(),
    value: z.any().optional(),
    description: z.string().optional(),
    label: z.string().optional(),
    hint: z.string().optional(),
    position: z.number().int().optional(),
    modal_label: z.string().optional(),
    refresh: z.boolean().optional(),
    options: z.array(
        z.object({
            label: z.string(),
            value: z.string(),
            icon_data: z.string().optional(),
        }),
    ).optional(),
    multiselect: z.boolean().optional(),
    lookup: z.any().optional(),
    subtype: z.string().optional(),
    min_length: z.number().int().optional(),
    max_length: z.number().int().optional(),
}).optional();

export const AddForm = z.object({
    title: z.string(),
    header: z.string(),
    icon: z.string(),
    fields: z.union([z.array(AppFormFieldValidator), z.tuple([])]),
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
    fields: z.union([z.array(AppFormFieldValidator), z.tuple([])]),
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
    fields: z.union([z.array(AppFormFieldValidator), z.tuple([])]),
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