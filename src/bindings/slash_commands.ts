import {AppBinding} from '../types';

import {getHelpBinding} from './bindings';
import {newCommandBindings} from '../utils/bindings';

export const getCommandBindings = (): AppBinding => {
    const bindings: AppBinding[] = [];

    bindings.push(getHelpBinding());
    return newCommandBindings(bindings);
};

