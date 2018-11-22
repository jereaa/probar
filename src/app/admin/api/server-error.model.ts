export enum ErrorCode {
    CLIENT_ERROR = 1,
    SERVICE_DUPLICATE_CODE = 1001
}

export interface ServerErrorModel extends Error {
    code: number;
}
