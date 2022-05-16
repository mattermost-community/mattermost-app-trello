import {AppBinding} from '../types';

import {getHelpBinding, getAddBinding, getNewBinding } from './bindings';
import {newCommandBindings} from '../utils/bindings';

export const getCommandBindings = (): AppBinding => {
    const bindings: AppBinding[] = [];

    bindings.push(getHelpBinding());
    bindings.push(getAddBinding());
    bindings.push(getNewBinding());
    return newCommandBindings(bindings);
};

