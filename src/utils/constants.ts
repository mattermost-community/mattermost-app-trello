export const FormTextAreaMinLength = 2;
export const FormTextAreaMaxLength = 1024;

import {AppSelectOption} from 'mattermost-redux/types/apps';

export const AppsPluginName = 'com.mattermost.apps';
export const PathAPI = '/api/v1';

// Routes to the Mattermost Instance
const MMPaths = {
    PathKV: '/kv',
    PathOAuth2App: '/oauth2/app',
    PathOAuth2User: '/oauth2/user',
    PathOAuth2CreateState: '/oauth2/create-state',
};

const TrelloPaths = {
    OAuthGetRequestToken: '/OAuthGetRequestToken',
    OAuthAuthorizeToken: '/OAuthAuthorizeToken',
    OAuthGetAccessToken: '/OAuthGetAccessToken',
    OAuthAuthorizationURI: '/oauth/authorizations/new',
    OAuthAccessTokenURI: '/oauth/tokens',
    TicketPathPrefix: '/agent/tickets',
    AccessURI: '/access/unauthenticated',
    APIVersion: '/api/v2',
    getMembers: 'members/me'
};


export const Routes = {
    MM: MMPaths,
    TP: TrelloPaths
};

export const Locations = {
    Connect: 'connect',
    Configure: 'configure',
    Disconnect: 'disconnect',
    Subscribe: 'subscribe',
    Ticket: 'ticket',
    Target: 'target',
    Help: 'help',
    Me: 'me',
};

export const StoreKeys = {
    config: 'config',
};

export const FieldTypes = {
    // System Types
    // Assignee: 'assignee',
    Subject: 'subject',
    Priority: 'priority',
    TicketType: 'tickettype',
    Description: 'description',

    // Custom UserField Types
    Text: 'text',
    MultiLine: 'textarea',
    Checkbox: 'checkbox',
    Date: 'date',
    Integer: 'integer',
    Decimal: 'decimal',
    Regex: 'regexp',
    Tagger: 'tagger',
    Muliselect: 'multiselect',
};

export const CreateTicketFields = {
    NameAdditionalMessage: 'additional_message',
    NamePostMessage: 'post_message',
    NameFormsSelect: 'ticket_form_id',
    PrefixCustomField: 'custom_field_',
};

const selectOptions: AppSelectOption[] = [];
export const SubscriptionFields = {

    //    255   - max allowed in the trigger title field in Zendesk
    //  -  47   - length of all constants (PrefixCustomDefinitionSubject PrefixTriggersTitle RegexTriggerTeamID RegexTriggerChannelID)
    //  -  50   = assume max instance name (conservative estimate. The only unknown)
    //  -  52   = uuid (26 * 2) channelID and teamID uuids
    // ------
    //    106
    // Call it 50 to be conservative
    MaxTitleNameLength: 50,

    ChannelPickerSelectLabel: 'Channel Name',
    ChannelPickerSelectName: 'channel_picker_name',

    SubSelectLabel: 'Select Subscription',
    SubSelectName: 'subscription_select_name',

    SubTextLabel: 'Name',
    SubTextName: 'subscription_text_name',

    DeleteButtonLabel: 'Delete',
    SubmitButtonsName: 'button_action',
    SubmitButtonsOptions: selectOptions,
    SaveButtonLabel: 'Save',

    NewSub_Hint: 'Name of your subscription',
    NewSub_OptionLabel: 'Create New',
    NewSub_OptionValue: 'newsubscription',

    ConditionTypes: ['all', 'any'],
    ConditionFieldSuffix: 'field',
    ConditionOperatorSuffix: 'operator',
    ConditionValueSuffix: 'value',

    PrefixCustomDefinitionSubject: 'custom_fields_',
    PrefixTriggersTitle: '__mm_webhook',
    RegexTriggerInstance: '__instance_',
    RegexTriggerChannelID: '__channelID_',
    RegexTriggerTeamID: '__teamID_',
    RegexTriggerTitle: '__mm_webhook__instance_(.*)__teamID_(\\w+)__channelID_(\\w+) (.*)',
};

SubscriptionFields.SubmitButtonsOptions = [
    {
        label: SubscriptionFields.DeleteButtonLabel,
        value: SubscriptionFields.DeleteButtonLabel,
    },
    {
        label: SubscriptionFields.SaveButtonLabel,
        value: SubscriptionFields.SaveButtonLabel,
    },
];

export const TriggerFields: any = {
    TicketIDKey: 'ticketID',
    TicketTitleKey: 'ticketTitle',
    ChannelIDKey: 'channelID',
    ActionField: 'notification_target',
    ActionValuePairs: {},
};

// ActionValuePairs is an object of static key value pairs that will be added to a trigger when saving in Zendesk
TriggerFields.ActionValuePairs[TriggerFields.TicketIDKey] = '{{ticket.id}}';
TriggerFields.ActionValuePairs[TriggerFields.TicketTitleKey] = '{{ticket.title}}';

// ZdFieldValidation is an object of Zendesk fields types that validates a field
// value against a regex.  The regex values are retreivable from the field
// list API, but are hardcoded here for simplicity
export const FieldValidation: any = {};
FieldValidation[FieldTypes.Integer] = {
    Regex: '^[+-]?\\d+$',
    RegexError: 'Numeric field not valid',
};
FieldValidation[FieldTypes.Decimal] = {
    Regex: '^[-+]?[0-9]*[.,]?[0-9]+$',
    RegexError: 'Decimal field not valid',
};
FieldValidation[FieldTypes.Date] = {
    Regex: '^([0-9]{4})-(1[0-2]|0[1-9])-(3[01]|[12][0-9]|0[1-9])$',
    RegexError: 'Date field not valid',
};
FieldValidation[FieldTypes.Regex] = {
    Regex: '^(http|https):\\/\\/[a-z0-9]+([-.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(([0-9]{1,5})?\\/.*)?$',
    RegexError: 'Regex field not valid',
};

export const SystemFields = ['subject'];
