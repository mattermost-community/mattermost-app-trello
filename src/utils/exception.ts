import {ExceptionLevel} from '../constant/exception-level';

export class Exception extends Error {
    constructor(
        public readonly level: ExceptionLevel,
        public readonly message: string
    ) {
        super(message);
    }
}
