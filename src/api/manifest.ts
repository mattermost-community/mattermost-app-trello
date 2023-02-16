import { Request, Response } from 'express';

import { isEmpty } from 'lodash';

import config from '../config';
import { Manifest } from '../types';
import manifest from '../manifest.json';

export function getPort(): number {
    return Number(process.env.PORT) || config.APP.PORT;
}

export function getHTTPPath(): string {
    const hostURL: string = config.APP.HOST;
    if (isEmpty(hostURL)) {
        return 'http://localhost:' + getPort();
    }
    return hostURL;
}

export function isRunningInHTTPMode(): boolean {
    return config.APP.LOCAL === 'true';
}

export function getManifest(request: Request, response: Response): void {
    let m: Manifest = manifest;

    if (isRunningInHTTPMode()) {
        const http = {
            root_url: getHTTPPath(),
            use_jwt: false,
        };
        m = { ...m, http };
    }

    response.json(m);
}