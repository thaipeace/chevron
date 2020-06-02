export const DEFAULT_KEYS = {
  BREADCRUMB_KEY: 'breadcrumb',
  BREADCRUMB_MODEL: 'model',
  BREADCRUMB_RESOLVE_MODEL_FN: 'resolveLabelFn',
  FALLBACK_URL: 'fallbackUrl'
};

export const NOTIFICATION_LONG_DURARION = 6000;
export const NOTIFICATION_DEFAULT_DURARION = 3000;
export const NOTIFICATION_CREATION_DURARION = 10000;

export const X_BUTTON = '×';

export const GET_COLOR_BY_PRODUCTCODE = (productCode: string): string => {
  switch (productCode) {
    case PRODUCT_CODE.EURO4_97:
      return COLORS.RED;
    case PRODUCT_CODE.PREMIUM_95:
      return COLORS.GOLD;
    case PRODUCT_CODE.B10_DIESEL:
    case PRODUCT_CODE.DIESEL_C:
      return COLORS.BROWN;
    case PRODUCT_CODE.EURO5_B7:
      return COLORS.BLUE;
    default:
      return COLORS.WHITE;
  }
};

enum COLORS {
  RED = '#ff5d6a',
  GOLD = '#ffe600',
  BROWN = '#c19669',
  BLUE = '#2496c9',
  WHITE = '#FFF'
}

export enum PRODUCT_CODE {
  EURO4_97 = 'Euro4-97',
  PREMIUM_95 = 'Premium-95',
  B10_DIESEL = 'B10-Diesel',
  DIESEL_C = 'Diesel-C',
  EURO5_B7 = 'Euro5-B7'
}

export const DATA_PRODUCT_CODE = ['Euro4-97', 'Premium-95', 'B10-Diesel', 'Diesel-C', 'Euro5-B7'];

export enum ORDER_STATUS {
  SYSTEM_SUGGESTED = 'SystemSuggested',
  POTENTIAL = 'Potential',
  ON_HOLD = 'OnHold',
  APPROVED = 'Approved',
  CANCELED = 'Canceled',
  RESCHEDULED = 'Rescheduled',
  LOADING = 'Loading',
  ON_TRANSIT = 'OutForDelivery',
  OUT_FOR_DELIVERY = 'OutForDelivery',
  UNLOADING = 'Unloading',
  DELIVERED = 'Delivered',
}

export enum TRIP_STATUS {
  SCHEDULED = 'Scheduled',
  AWAITING_LOADING = 'AwaitingLoading',
  LOADING = 'Loading',
  IN_TRANSIT_OUTBOUND = 'InTransitOutbound',
  UNLOADING = 'Unloading',
  IN_TRANSIT_RETURNING = 'InTransitReturning',
  AT_TERMINAL_POST_TRIP = 'AtTerminalPostTrip',
  COMPLETED = 'Completed',
}

export namespace ENUM_NP {
  export function indexOfKey(enumSet: any, s: string): number {
    return Object.keys(enumSet).indexOf(s);
  }

  export function indexOfValue(enumSet: any, s: string): number {
    let index = -1;
    const keys = Object.keys(enumSet);
    while (index < keys.length - 1) {
      index++;
      if (enumSet[keys[index]] === s) {
        break;
      }
    }
    return index;
  }
}

export enum TRUCK_STATUS {
  IN_SERVICE = 'InService',
  OUT_OF_SERVICE = 'OutOfService'
}

export enum DRIVER_STATUS {
  A = 'A',
  P = 'P'
}

export enum TRUCK_COLOR {
  Gone = '#2496c9',
  GOING = '#4a6170'
}

export enum ORDER_TIME_WINDOW {
  FIRST_WINDOW = 'First Window',
  SECOND_WINDOW = 'Second Window'
}

export enum SCHEDULE_STATUS {
  AWAITING_APPROVAL = 'AwaitingApproval',
  PLANNER_APPROVED = 'PlannerApproved'
}

export const ORDER_ITEM_COLOR = {
  approved: '#33b6f1',
  canceled: '#ff5d6a',
  delivered: '#86cf52',
  loading: '#919cff',
  onHold: '#f8a13f',
  outForDelivery: '#ffe600',
  potential: '#f4ff91',
  rescheduled: '#1cbfae',
  unloading: '#ffa4d1'
};

export const ORDER_PRODUCT_COLOR = {
  'B10-Diesel': '#c19669',
  'Euro4-97': '#e8646e',
  'Euro5-B7': '#2496c9',
  'Premium-95': '#ffe600'
};

export const COLOR_TANK_LEVEL = {
  TOTAL: '#ffffff',
  MAX_FILL: '#86cf52',
  PREFERRED_FILL: '#ffe600',
  DEAD_STOCK: '#ff5d6a',
};

export const ORDER_ITEM_TRANSLATE = {
  approved: 'Order Approved',
  canceled: 'Order Get Canceled',
  delivered: 'Order Delivered',
  loading: 'Order Loading',
  onHold: 'Order On Hold',
  outForDelivery: 'Order In Transit',
  potential: 'Order Potential',
  rescheduled: 'Order Get Rescheduled',
  unloading: 'Order Unloading'
};

export const TRUCK_DEFAUTLS = {
  DEFAULT_HISTORY_DATA_BY_DAY: 3
};

export const TABLE_COLUMN_HEAD = {
  dayStock: ['subDayStock'],
  dayStockSub: ['stationName'],
  customerDetails: ['subCustomerDetails', 'subCustomerDetailsEmpty'],
  customerDetailsSub: ['catEmpty', 'catEmptySub'],
  inventoryVarianceEntry: ['IMEEuro497', 'IMEPremium95', 'IMEB10Diesel', 'IMEEuro5B7', 'IMERemarks', 'inventoryVarianceEntryEmpty'],
  inventoryVarianceEntrySub: ['subIMEEuro497', 'subIMEPremium95', 'subIMEB10Diesel', 'subIMEEuro5B7', 'subIMERemarks', 'inventoryVarianceEntrySubEmpty'],
  inventoryVarianceComputeManual: ['IVCMEuro497', 'IVCMPremium95', 'IVCMB10Diesel', 'IVCMEuro5B7', 'IVCMEmpty'],
  inventoryVarianceComputeManualSub: [
    'stockEuro497',
    'varEuro497',
    'stockPremium95',
    'varPremium95',
    'stockB10Diesel',
    'varB10Diesel',
    'stockEuro5B7',
    'varEuro5B7',
    'IVCMEmptySub'
  ],
  uGTDayStock: ['UGTDSEuro497', 'UGTDSPremium95', 'UGTDSB10Diesel', 'UGTDSEuro5B7', 'UGTDSEmpty'],
  uGTDayStockSub: [
    'blockUGTDSEuro497',
    'blockUGTDSPremium95',
    'blockUGTDSB10Diesel',
    'blockUGTDSEuro5B7',
    'UGTDSEmptySub'
  ],
  underGroundTankUllage: ['UGTUSEuro497', 'UGTUSPremium95', 'UGTUSB10Diesel', 'UGTUSEuro5B7', 'UGTUSEmpty'],
  underGroundTankUllageSub: [
    'blockUGTUSEuro497',
    'blockUGTUSPremium95',
    'blockUGTUSB10Diesel',
    'blockUGTUSEuro5B7',
    'UGTUSEmptySub'
  ],
  deliverySchedulePlanning: [
    'DSPOrderNumber',
    'DSPEuro497',
    'DSPPremium95',
    'DSPB10Diesel',
    'DSPEuro5B7',
    'TotalQuantity',
    'ETA',
    'DSPRemarks',
    'deliverySchedulePlanningEmptySub'
  ],
  deliverySchedulePlanningSub: [
    'blockDSPOrderNumber',
    'blockDSPEuro497',
    'blockDSPPremium95',
    'blockDSPB10Diesel',
    'blockDSPEuro5B7',
    'blockTotalQuantity',
    'blockETA',
    'blockDSPRemarks',
    'deliverySchedulePlanningSubEmpty'
  ],
  quotaAllocations: ['QAB10Diesel'],
  quotaAllocationsSub: ['Balance', 'Approve']
};

export const TABLE_COLUMN_GROUP = [
  'dayStock',
  'customerDetails',
  'customerDetailsEmpty',
  'inventoryVarianceEntry',
  'inventoryVarianceEntryEmpty',
  'inventoryVarianceComputeManual',
  'inventoryVarianceComputeManualEmpty',
  'uGTDayStock',
  'uGTDayStockEmpty',
  'underGroundTankUllage',
  'underGroundTankUllageEmpty',
  'deliverySchedulePlanning',
  'deliverySchedulePlanningEmpty',
  'quotaAllocations'
];

export const TABLE_COLUMN_GROUP_DATA = [
  'customerDetails',
  'inventoryVarianceEntry',
  'inventoryVarianceComputeManual',
  'uGTDayStock',
  'underGroundTankUllage',
  'deliverySchedulePlanning',
  'quotaAllocations'
];

export const TABLE_COLUMN_GROUP_DATA_DROPDOWN = [
  {name: 'Customer Details', value: 'customerDetails'},
  {name: 'Inventory Manual(M) Entry', value: 'inventoryVarianceEntry'},
  {name: 'Inventory Variance (Compute & Manual)', value: 'inventoryVarianceComputeManual'},
  {name: 'UGT Day Stock', value: 'uGTDayStock'},
  {name: 'Under Ground Tank(UGT) Ullage', value: 'underGroundTankUllage'},
  {name: 'Delivery Schedule Planning', value: 'deliverySchedulePlanning'},
  {name: 'Quota Allocations', value: 'quotaAllocations'}
];

export const TABLE_COLUMN_GROUP_DATA_NONE = [
  'inventoryVarianceComputeManual',
  'uGTDayStock',
  'underGroundTankUllage',
  'quotaAllocations'
];

export const FUEL_TYPES = ['Euro4-97', 'Premium-95', 'B10-Diesel', 'Euro5-B7'];

//GUID for question mark

export const GUID_QUESTION_MARK = [
  'bbcb279f-1510-42e9-8c1f-6c46fb770d4a',
  'a01ebd2c-20d7-4a2d-95e4-cd8877b88644',
  'e40a343a-3c1b-43fa-81a0-a2d30a68e893',
  '43ae7092-f51f-4e77-9b2f-536d62b8d455',
  'a0f4a6c7-9235-4fdc-9f91-ff7fe2d93ba5',
  'c6fa21a6-ded8-4ae4-80dd-7e8e08739f25',
  '461c23cd-b18f-45f2-b43b-445d3421cf6e',
  '24b1f264-b5d4-4569-8331-9da47e94e7c1',
  '991b1ed5-d81f-4b52-9783-c7e2d572d690',
  '4a42334b-4eb4-4430-ad05-27465959a030'
];
