export enum LOGIN_RESULT {
    SUCCESS,
    SUCCESS_WITH_PASSWORD_EXPIRED,
    FAIL
}

export interface ILoginResult {
    isSuccess: boolean;
    message?: string;
}