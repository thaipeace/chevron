declare const CHEVRON_MODULE_CONFIG: any;
declare const ATOMITON_DATA_HISTORY_CONFIG: any;
declare const APP: any;
const protocol = CHEVRON_MODULE_CONFIG['USING_SSL'] ? 'https' : 'http';
const wsprotocol = CHEVRON_MODULE_CONFIG['USING_SSL'] ? 'wss' : 'ws';
const dataHistoryProtocol = ATOMITON_DATA_HISTORY_CONFIG['USING_SSL'] ? 'https' : 'http';

export const DEFAULT_ENDPOINTS = {
  DEFAULT: `${protocol}://${CHEVRON_MODULE_CONFIG['APP_END_POINT']}/fid-${CHEVRON_MODULE_CONFIG['APP_FID']}`,
  DATA_FM_HISTORY: `${dataHistoryProtocol}://${ATOMITON_DATA_HISTORY_CONFIG['APP_END_POINT']}/fid-${ATOMITON_DATA_HISTORY_CONFIG['APP_FID']}`,
  DOWNLOAD: `${protocol}://${CHEVRON_MODULE_CONFIG['APP_END_POINT']}/fid-downloads/`
};

export const DEFAULT_VALUES = {
  HEADER_TOKEN: 'usertoken',
  HEADER_APP_NAME: 'appName',
  APP_NAME: CHEVRON_MODULE_CONFIG['APP_NAME'],
  STORAGE_KEY: CHEVRON_MODULE_CONFIG['STORAGE_KEY'],
  VERSION: APP.version.substr(1),
  PHONE: APP.phone,
  EMAIL: APP.email
};

export const DEFAULT_MAP = {
  KEY: CHEVRON_MODULE_CONFIG['GOOGLE_MAP_KEY'],
  LOCATION: CHEVRON_MODULE_CONFIG['DEFAULT_MAP_LOCATION']
};

export const DEFAULT_WS_TRIGGER_POINT = {
  DEFAULT: `${wsprotocol}://${CHEVRON_MODULE_CONFIG['APP_END_POINT']}/fid-${
    CHEVRON_MODULE_CONFIG['APP_WS_ID']
  }`
};
