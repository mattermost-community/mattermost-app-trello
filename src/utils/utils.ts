import { AppField } from "../types";

export function errorWithMessage(err: Error, message: string): string {
    return `"${message}".  ` + err.message;
}

export function isFieldValueSelected(field: AppField): boolean {
    return Boolean(field.value);
}

export function baseUrlFromContext(mattermostSiteUrl: string): string {
    return mattermostSiteUrl || 'http://localhost:8066';
}

export function replace(value: string, searchValue: string, replaceValue: string): string {
    return value.replace(searchValue, replaceValue);
}

export function errorOpsgenieWithMessage(error: Error | any, message: string): string {
    const errorMessage: string = error?.data?.message || error.message;
    return `"${message}".  ${errorMessage}`;
}

export async function tryPromiseWithMessage(p: Promise<any>, message: string): Promise<any> {
    return p.catch((error) => {
        console.log('error', error);
        throw new Error(errorWithMessage(error, message));
    });
}

export async function tryPromiseOpsgenieWithMessage(p: Promise<any>, message: string): Promise<any> {
    return p.catch((error) => {
        console.log('error', error.response.data);
        throw new Error(errorOpsgenieWithMessage(error.response, message));
    });
}
