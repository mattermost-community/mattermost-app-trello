import {AppsState} from '../types';
import {getCommandBindings} from './slash_commands';

export async function getAppBindings(context: any): Promise<AppsState[]> {
    const bindings: AppsState[] = [];
    bindings.push(await getCommandBindings(context));

    return bindings;
}
