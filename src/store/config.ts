import {AppCallValues} from 'mattermost-redux/types/apps';

import {StoreKeys} from '../utils/constants';
import {AppsClient, newAppsClient} from '../clients';
import {baseUrlFromContext} from '../utils';

export type AppConfigStore = {
    trello_apikey: string;
    trello_oauth_access_token: string;
    trello_webhook: string;
}

export interface ConfigStore {
    getValues(): Promise<AppConfigStore>;
    storeConfigInfo(values: AppCallValues): Promise<void>;
}

class ConfigStoreImpl implements ConfigStore {
    storeData: AppConfigStore;
    ppClient: AppsClient;

    constructor(botToken: string, url: string) {
        this.ppClient = newAppsClient(botToken, url);
        this.storeData = {} as AppConfigStore;
    }

    async storeConfigInfo(store: AppConfigStore): Promise<void> {
        await this.ppClient.kvSet(StoreKeys.config, store);
    }

    async getValues(): Promise<AppConfigStore> {
        const config = await this.ppClient.kvGet(StoreKeys.config);
        if (config) {
            this.storeData.trello_webhook = config.trello_webhook || '';
            this.storeData.trello_apikey = config.trello_apikey || '';
            this.storeData.trello_oauth_access_token = config.trello_oauth_access_token || '';
        }
        return this.storeData;
    }
}

export const newConfigStore = (botAccessToken: string, mattermostSiteUrl: string): ConfigStore => {
    const baseURL = baseUrlFromContext(mattermostSiteUrl);
    return new ConfigStoreImpl(botAccessToken, baseURL);
};
