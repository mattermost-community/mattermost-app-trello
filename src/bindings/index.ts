import {AppsState} from '../types';
import {getCommandBindings} from './slash_commands';

export function getAppBindings(context: any): AppsState[] {
    const bindings: AppsState[] = [];
    bindings.push(getCommandBindings());

    return bindings;
}
