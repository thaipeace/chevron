var APP = {
  version: 'v1.5.0.20200212',
  phone: '+60322896861',
  email: 'nmnx@chevron.com'
}

// var ATOMITON_USER_MANAGEMENT_MODULE_CONFIG = {
//   APP_END_POINT: "chevron.atomiton.com",
//   APP_FID: "NDBWQGHBAOAMBKBYABTHEP6Z",
//   APP_NAME: 'UM',
//   USING_SSL: true,
//   STORAGE_KEY: "ATOMITON_LOGIN"
// };
//
// var CHEVRON_MODULE_CONFIG = {
//   APP_END_POINT: "chevron.atomiton.com",
//   APP_FID: "NDBWQGHBAOAMBKBYABTHEP6Z",
//   APP_NAME: 'ChevronBE',
//   USING_SSL: true,
//   STORAGE_KEY: "ATOMITON_CHEVRON",
//   DEFAULT_MAP_LOCATION: "2.967125, 101.350676",
//   GOOGLE_MAP_KEY:"AIzaSyDpEj9HxyEcxum6NTmoBCM0CWEpr_c_-ug",
//   APP_WS_ID: "NLZVYIOJAAAKYHYPRSBKMP4DWS"
// };

// var ATOMITON_USER_MANAGEMENT_MODULE_CONFIG = {
//   APP_END_POINT: 'chevrondevqa.atomiton.com:8080',
//   APP_FID: 'NDBWQGHBAOAMBKBYABTHEP6Z',
//   APP_NAME: 'UM',
//   USING_SSL: false,
//   STORAGE_KEY: 'ATOMITON_LOGIN'
// };

// var CHEVRON_MODULE_CONFIG = {
//   APP_END_POINT: 'chevrondevqa.atomiton.com:8080',
//   APP_FID: 'NDBWQGHBAOAMBKBYABTHEP6Z',
//   APP_NAME: 'ChevronBE',
//   USING_SSL: false,
//   STORAGE_KEY: 'ATOMITON_CHEVRON',
//   DEFAULT_MAP_LOCATION: '2.9682056,101.318992',
//   GOOGLE_MAP_KEY: 'AIzaSyDpEj9HxyEcxum6NTmoBCM0CWEpr_c_-ug',
//   APP_WS_ID: 'NKGL3XTKAAAKYHYTM2H2CL3VWS'
// };

// var ATOMITON_USER_MANAGEMENT_MODULE_CONFIG = {
//     APP_END_POINT: "18.139.84.209:8080",
//     APP_FID: "NDBWQGHBAOAMBKBYABTHEP6Z",
//     APP_NAME: 'UM',
//     USING_SSL: false,
//     STORAGE_KEY: "ATOMITON_LOGIN"
// };
//
// var CHEVRON_MODULE_CONFIG = {
//     APP_END_POINT: "18.139.84.209:8080",
//     APP_FID: "NDBWQGHBAOAMBKBYABTHEP6Z",
//     APP_NAME: 'ChevronBE',
//     USING_SSL: false,
//     STORAGE_KEY: "ATOMITON_CHEVRON",
//     DEFAULT_MAP_LOCATION: "2.967125,101.350676",
//     GOOGLE_MAP_KEY:"AIzaSyDpEj9HxyEcxum6NTmoBCM0CWEpr_c_-ug",
//     APP_WS_ID: "NKGL3XTKAAAKYHYTM2H2CL3VWS"
// };

/** QA server **/
var ATOMITON_USER_MANAGEMENT_MODULE_CONFIG = {
  APP_END_POINT: "chevronqa.atomiton.com:8080", //chevronqa.atomiton.com, chevronqa.atomiton.com:8080
  APP_FID: "NDBWQGHBAOAMBKBYABTHEP6Z", //KOTerminal, NDBWQGHBAOAMBKBYABTHEP6Z
  APP_NAME: 'UM',
  USING_SSL: false,
  STORAGE_KEY: "ATOMITON_LOGIN"
};

var ATOMITON_DATA_HISTORY_CONFIG = {
  APP_END_POINT: "13.127.255.228:8081", //chevron.atomiton.com:8080
  APP_FID: "DataFMHistory",
  APP_NAME: 'unset', //Unset is not pass this header param to request
  USING_SSL: false
};

var CHEVRON_MODULE_CONFIG = {
  APP_END_POINT: "chevronqa.atomiton.com:8080", //chevronqa.atomiton.com, chevronqa.atomiton.com:8080
  APP_FID: "NDBWQGHBAOAMBKBYABTHEP6Z", //KOTerminal, NDBWQGHBAOAMBKBYABTHEP6Z
  APP_NAME: 'ChevronBE',
  USING_SSL: false,
  STORAGE_KEY: "ATOMITON_CHEVRON",
  DEFAULT_MAP_LOCATION: "2.967125,101.350676",
  GOOGLE_MAP_KEY: "AIzaSyDpEj9HxyEcxum6NTmoBCM0CWEpr_c_-ug",
  APP_WS_ID: "NLZVYIOJAAAKYHYPRSBKMP4DWS"
};
/** End QA server **/

/** Integration server **/
// var ATOMITON_USER_MANAGEMENT_MODULE_CONFIG = {
//     APP_END_POINT: "chevrondevinteg.atomiton.com:8080",
//     APP_FID: "NDBWQGHBAOAMBKBYABTHEP6Z",
//     APP_NAME: 'UM',
//     USING_SSL: false,
//     STORAGE_KEY: "ATOMITON_LOGIN"
// };

// var ATOMITON_DATA_HISTORY_CONFIG = {
//     APP_END_POINT: "13.127.255.228:8081", // chevron.atomiton.com:8080
//     APP_FID: "DataFMHistory",
//     APP_NAME: 'unset', //Unset is not pass this header param to request
//     USING_SSL: false,
//     STORAGE_KEY: "ATOMITON_CHEVRON"
// };

// var CHEVRON_MODULE_CONFIG = {
//     APP_END_POINT: "chevrondevinteg.atomiton.com:8080",
//     APP_FID: "NDBWQGHBAOAMBKBYABTHEP6Z",
//     APP_NAME: 'ChevronBE',
//     USING_SSL: false,
//     STORAGE_KEY: "ATOMITON_CHEVRON",
//     DEFAULT_MAP_LOCATION: "2.967125,101.350676",
//     GOOGLE_MAP_KEY: "AIzaSyDpEj9HxyEcxum6NTmoBCM0CWEpr_c_-ug",
//     APP_WS_ID: "NLZVYIOJAAAKYHYPRSBKMP4DWS"
// };
/** End Integration server **/

// var ATOMITON_USER_MANAGEMENT_MODULE_CONFIG = {
//     APP_END_POINT: "chevrondevqa.atomiton.com:8080",
//     APP_FID: "NDBWQGHBAOAMBKBYABTHEP6Z",
//     APP_NAME: 'UM',
//     USING_SSL: false,
//     STORAGE_KEY: "ATOMITON_LOGIN"
// };

// var CHEVRON_MODULE_CONFIG = {
//     APP_END_POINT: "chevrondevqa.atomiton.com:8080",
//     APP_FID: "NDBWQGHBAOAMBKBYABTHEP6Z",
//     APP_NAME: 'ChevronBE',
//     USING_SSL: false,
//     STORAGE_KEY: "ATOMITON_CHEVRON",
//     DEFAULT_MAP_LOCATION: "2.967125,101.350676",
//     GOOGLE_MAP_KEY:"AIzaSyDpEj9HxyEcxum6NTmoBCM0CWEpr_c_-ug",
//     APP_WS_ID: "NKGL3XTKAAAKYHYTM2H2CL3VWS"
// };