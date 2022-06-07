import {AppBinding, AppsState} from '../types';

import {
    getHelpBinding,
    getSubscriptionBinding,
    getConfigureBinding,
    getCardBinding,
    getAccountBinding
} from "./bindings";
import {
    AppBindingLocations,
    Commands,
    CommandTrigger,
    StoreKeys,
    TrelloIcon
} from "../constant";
import {ConfigStoreProps, KVStoreClient, KVStoreOptions, StoredOauthUserToken} from '../clients/kvstore';
import {isUserSystemAdmin} from "../utils";

const newCommandBindings = (bindings: AppBinding[]): AppsState => {
    const commands: string[] = [
        Commands.HELP,
        Commands.CARD,
        Commands.SUBSCRIPTION,
        Commands.CONFIGURE,
        Commands.ACCOUNT
    ];

    return {
        location: AppBindingLocations.COMMAND,
        bindings: [
            {
                icon: TrelloIcon,
                label: CommandTrigger,
                hint: `[${commands.join(' | ')}]`,
                bindings,
            },
        ],
    };
};

export const getCommandBindings = async (context: any): Promise<AppsState> => {
    const mattermostUrl: string | undefined = context.mattermost_site_url;
    const botAccessToken: string | undefined = context.bot_access_token;
    const options: KVStoreOptions = {
        mattermostUrl: <string>mattermostUrl,
        accessToken: <string>botAccessToken,
    };
    const kvClient = new KVStoreClient(options);
    const trelloConfig: ConfigStoreProps = await kvClient.kvGet(StoreKeys.config);
    const oauthToken: StoredOauthUserToken = await kvClient.getOauth2User(context.acting_user.id)
    
    const bindings: AppBinding[] = [];
    bindings.push(getHelpBinding());
    if (isUserSystemAdmin(context.acting_user))
        bindings.push(getConfigureBinding());
    if (!Object.keys(trelloConfig).length) {
        if (!Object.keys(oauthToken).length) {
            bindings.push(getCardBinding());
            bindings.push(getSubscriptionBinding());
        }
        bindings.push(getAccountBinding());
    }
    return newCommandBindings(bindings);
};

