import { ExceptionType } from '../constant';

export default class Exception extends Error {
    constructor(
        public readonly type: ExceptionType,
        public readonly message: string
    ) {
        super(message);
    }
}
