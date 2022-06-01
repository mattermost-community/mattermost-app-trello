import { AppField } from "../types";

export async function tryPromiseWithMessage(p: Promise<any>, message: string): Promise<any> {
    return p.catch((err) => {
        throw new Error(errorWithMessage(err, message));
    });
}

export function errorWithMessage(err: Error, message: string): string {
    return `"${message}".  ` + err.message;
}

export function isFieldValueSelected(field: AppField): boolean {
    return Boolean(field.value);
}

export function baseUrlFromContext(mattermostSiteUrl: string): string {
    return mattermostSiteUrl || 'http://localhost:8065';
}