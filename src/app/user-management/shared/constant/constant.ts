declare const ATOMITON_USER_MANAGEMENT_MODULE_CONFIG: any;
const protocol = ATOMITON_USER_MANAGEMENT_MODULE_CONFIG['USING_SSL'] ? 'https' : 'http';
export const DEFAULT_ENDPOINTS = {
  LOGIN: `${protocol}://${ATOMITON_USER_MANAGEMENT_MODULE_CONFIG['APP_END_POINT']}/fid-Authentication/login`,
  LOGOUT: `${protocol}://${ATOMITON_USER_MANAGEMENT_MODULE_CONFIG['APP_END_POINT']}/fid-Authentication/logout`,
  DEFAULT: `${protocol}://${ATOMITON_USER_MANAGEMENT_MODULE_CONFIG['APP_END_POINT']}/fid-${ATOMITON_USER_MANAGEMENT_MODULE_CONFIG['APP_FID']}`
};

export const DEFAULT_PAYLOADS = {
  GET_USER_DETAILS: `
    <find>
        <User as="var.user">
            <username>{0}</username>
        </User>
         <Role>
          <sysId>var.user.roleId</sysId>
        </Role>
    </find>`,
  CHANGE_PASSWORD: `
    <ChangePassword>
        <userName>{userName}</userName>
        <oldPassword>{oldPassword}</oldPassword>
        <password>{password}</password>
    </ChangePassword>
    `
};

export const USER_MANAGEMENT_DEFAULT_VALUES = {
  HEADER_TOKEN: 'usertoken',
  HEADER_APP_NAME: 'appName',
  APP_NAME: ATOMITON_USER_MANAGEMENT_MODULE_CONFIG['APP_NAME'],
  STORAGE_KEY: ATOMITON_USER_MANAGEMENT_MODULE_CONFIG['STORAGE_KEY']
};
