export function replace(value: string, searchValue: string, replaceValue: string): string {
  return value.replace(searchValue, replaceValue);
}

export function errorWithMessage(error: Error, message: string): string {
  return `"${message}".  ${error.message}`;
}

export function errorOpsgenieWithMessage(error: Error|any, message: string): string {
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
      console.log('error', error);
      throw new Error(errorOpsgenieWithMessage(error.response, message));
  });
}
