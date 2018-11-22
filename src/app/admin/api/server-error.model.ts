export enum ErrorCode {
    CLIENT_ERROR = 1,
    SERVICE_DUPLICATE_CODE = 1001,
    SERVICE_CODE_NOT_FOUND = 1002
}

export interface ServerErrorModel extends Error {
    code: number;
}
