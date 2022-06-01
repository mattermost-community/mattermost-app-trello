import Client4 from 'mattermost-redux/client/client4.js';
import { AppCallResponse, AppForm, AppCallRequest, AppField } from '../types';
import { AppCallValues} from 'mattermost-redux/types/apps';

import { FieldsBuilder, newFieldsBuilder } from './helper_classes/fields/fields_builder';
import { TrelloClient } from '../clients/trello';


const DefaultMinLength = 2;
const DefaultMaxLength = 1024;

// BaseFormFields call provides base methods for retrieving viewable modal app fields
export class BaseFormFields {
    call: AppCallRequest;
    builder: FieldsBuilder;
    client: TrelloClient;

    constructor(call: AppCallRequest, client: TrelloClient) {
        this.call = call;
        this.builder = newFieldsBuilder(this.call);
        this.builder.setDefaultMinLength(DefaultMinLength);
        this.builder.setDefaultMaxLength(DefaultMaxLength);
        this.client = client;
    }

    getCurrentTeamID(): string {
        return this.call.context.team_id || '';
    }

    getCurrentChannelID(): string {
        return this.call.context.channel.id || '';
    }

    getCallValues(): AppCallValues {
        return this.call.values as AppCallValues;
    }
}
