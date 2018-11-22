export enum ErrorCode {
    SERVICE_DUPLICATE_CODE = 1001,
    SERVICE_CODE_NOT_FOUND = 1002
}

export class ServerError implements Error {
    constructor(
        readonly name: string,
        readonly message: string,
        readonly code: number
    ) {}
}
