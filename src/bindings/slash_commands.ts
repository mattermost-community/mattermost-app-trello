import {AppBinding, AppsState} from '../types';

import {getHelpBinding, getSubscriptionBinding, getConfigureBinding, getCardBinding } from './bindings';
import {newCommandBindings} from '../utils/bindings';

export const getCommandBindings = (): AppsState => {
    const bindings: AppBinding[] = [];

    bindings.push(getHelpBinding());
    //bindings.push(getAddBinding());
    //bindings.push(getNewBinding());
    bindings.push(getCardBinding());
    //bindings.push(getLinkBinding());
    bindings.push(getSubscriptionBinding());
    bindings.push(getConfigureBinding());
    return newCommandBindings(bindings);
};

