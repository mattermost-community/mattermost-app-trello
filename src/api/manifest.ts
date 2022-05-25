import {Request, Response} from 'express';
import config from '../config';
import {Manifest} from '../types';
import manifest from '../manifest.json';

export function getManifest(request: Request, response: Response): void {
    const m: Manifest = manifest;

    m.http.root_url = `${config.APP.HOST}:${config.APP.PORT}`;

    response.json(m);
}

function getPort(): number {
    return Number(process.env.PORT) || config.APP.PORT;
}

export function getHTTPPath(): string {
    return `${config.APP.HOST}:${getPort()}`;
}

export function getManifestData(): Manifest {
    const m: Manifest = manifest;

    m.http.root_url = getHTTPPath();

    return m;
}