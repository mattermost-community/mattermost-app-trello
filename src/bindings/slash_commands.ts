import {AppBinding, AppsState} from '../types';

import {getHelpBinding, getAddBinding, getNewBinding, getLinkBinding } from './bindings';
import {newCommandBindings} from '../utils/bindings';

export const getCommandBindings = (): AppsState => {
    const bindings: AppBinding[] = [];

    console.log(JSON.stringify(getNewBinding()))

    bindings.push(getHelpBinding());
    bindings.push(getAddBinding());
    bindings.push(getNewBinding());
    bindings.push(getLinkBinding());
    return newCommandBindings(bindings);
};

