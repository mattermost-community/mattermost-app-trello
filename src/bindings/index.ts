import {AppBinding} from '../types';
import {getCommandBindings} from './slash_commands';

export function getAppBindings(context: any): AppBinding[] {
    const bindings: AppBinding[] = [];
    bindings.push(getCommandBindings());

    return bindings;
}
