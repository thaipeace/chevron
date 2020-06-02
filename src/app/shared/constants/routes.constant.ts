const SETTING_ROUTES = [
  {
    name: 'Settings',
    route: 'admin/settings',
    icon: 'fas fa-sliders-h',
    position: 'bottom',
    /*menus: [
      {
        name: 'Organization Profile',
        route: 'remote/admin/settings/organization-profile',
        icon: ''
      },
      {
        name: 'System Parameters',
        route: 'admin/settings/system-parameters',
        icon: ''
      },
      {
        name: 'Trip References',
        route: 'remote/settings/trip-references',
        icon: ''
      },
      {
        name: 'Terminals',
        route: 'remote/settings/terminals',
        icon: ''
      },
      {
        name: 'Regions',
        route: 'remote/settings/regions',
        icon: ''
      },
      {
        name: 'Supply Points',
        route: 'remote/settings/supply-points',
        icon: ''
      },
      {
        name: 'Fleet Bases',
        route: 'remote/settings/fleet-bases',
        icon: ''
      },
      {
        name: 'Truck Stops',
        route: 'remote/settings/truck-stops',
        icon: ''
      },
      {
        name: 'Exception Areas',
        route: 'remote/settings/exception-areas',
        icon: ''
      },
      {
        name: 'Base Product Types',
        route: 'remote/settings/base-product-types',
        icon: ''
      },
      {
        name: 'Product Types',
        route: 'remote/settings/product-types',
        icon: ''
      },
      {
        name: 'Help Links',
        route: 'remote/settings/help-links',
        icon: ''
      }
    ],*/
    groups: [
      {
        name: 'General',
        menus: [
          {
            name: 'Organization Profile',
            route: 'admin/settings/organization-profile',
            icon: ''
          },
          {
            name: 'System Parameters',
            route: 'admin/settings/system-parameters',
            icon: ''
          },

        ],
      },
      {
        name: 'Product Definitions',
        menus: [
          {
            name: 'Base Product Types',
            route: 'admin/settings/base-product-types',
            icon: ''
          },
          {
            name: 'Product Types',
            route: 'admin/settings/product-types',
            icon: ''
          },
        ],
      },
      {
        name: 'Terminal Configuration',
        menus: [
          {
            name: 'Terminals',
            route: 'admin/settings/terminals',
            icon: ''
          },
          {
            name: 'Supply Points',
            route: 'admin/settings/supply-points',
            icon: ''
          },
          {
            name: 'Regions',
            route: 'admin/settings/regions',
            icon: ''
          },
          {
            name: 'Delivery Point Groups',
            route: 'admin/settings/delivery-point-groups',
            icon: ''
          },
          {
            name: 'Fleet Bases',
            route: 'admin/settings/fleet-bases',
            icon: ''
          },
          {
            name: 'Truck Stops',
            route: 'admin/settings/truck-stops',
            icon: ''
          },
          {
            name: 'Exception Areas',
            route: 'admin/settings/exception-areas',
            icon: ''
          },
          {
            name: 'Trip Preferences',
            route: 'admin/settings/trip-preferences',
            icon: ''
          },
          {
            name: 'Order Import Product Mappings',
            route: 'admin/settings/order-import-product-mapping',
            icon: ''
          }
        ],
      },
      {
        name: 'Help',
        menus: [
          {
            name: 'Help Documents',
            route: 'admin/settings/help-documents',
            icon: ''
          },
          {
            name: 'Help Links',
            route: 'admin/settings/help-links',
            icon: ''
          }
        ],
      },
    ]
  }
];

const PLANNER_ROUTES = [
  {
    name: 'Customer Inventory',
    route: 'terminal-planner/inventory-management',
    icon: 'fal fa-analytics',
    menus: [
      {
        name: 'Current Inventory',
        route: 'terminal-planner/inventory-management/current',
        icon: '',
      },
      {
        name: 'Historical Inventory',
        route: 'terminal-planner/inventory-management/historical',
        icon: '',
      }
    ]
  },
  {
    name: 'Quotas',
    route: 'terminal-planner/quota-management',
    // icon: 'fal fa-usd-square',
    image: 'menu-icon/Quota-01.svg'
  },
  {
    name: 'Order Generation',
    route: 'terminal-planner/ar/order',
    image: 'menu-icon/process.png',
    // menus: [
    //     {
    //         name: 'Order',
    //         route: 'terminal-planner/ar/order',
    //         icon: '',
    //     },
    //     {
    //         name: 'Truck',
    //         route: 'terminal-planner/ar/truck',
    //         icon: '',
    //     }
    // ]
  },
  {
    name: 'Orders',
    route: 'terminal-planner/order-management',
    icon: 'fal fa-boxes'
  },
  {
    name: 'Delivery Schedule',
    route: 'terminal-planner/truck-schedule',
    // icon: 'fal fa-truck-container',
    image: 'menu-icon/DeliverySchedule-01.svg',
    /*menus: [
      {
        name: 'Trips',
        route: 'terminal-planner/truck-schedule/trips',
        icon: '',
      }
    ]*/
  },
  {
    name: 'Delivery Execution',
    route: 'terminal-planner/delivery',
    // icon: 'fal fa-shipping-fast',
    image: 'menu-icon/DeliveryExecutionManagement-01.svg'
  },
  {
    name: 'Reports',
    route: 'terminal-planner/reports',
    icon: 'fal fa-file-chart-pie'
  },
  {
    name: 'Data Import',
    route: 'terminal-planner/data-import',
    icon: 'fal fa-file-import'
  },
  {
    name: 'Events',
    route: 'terminal-planner/notification-management',
    icon: 'fal fa-exclamation-triangle',
  },
  {
    name: 'Systems',
    route: 'terminal-planner/system-information',
    icon: 'fal fa-cogs',
    menus: [
      {
        name: 'Analytics Artifacts',
        route: 'terminal-planner/system-information/analytics-artifacts',
        icon: '',
      },
      {
        name: 'Activity Management',
        route: 'terminal-planner/system-information/activity-management',
        icon: '',
      }
    ]
  }
];

const FLEET_OPERATION_ROUTES = [
  {
    name: 'Availability',
    route: 'fleet/operator/truck-driver-mapping',
    icon: 'fal fa-history'
  },
  {
    name: 'Driver History',
    route: 'fleet/operator/driver-history',
    icon: 'fal fa-history',
    disabled: true,
    isMarkForFunctionality: true
  },
  {
    name: 'Resources',
    route: 'fleet/operator/fleet-management',
    // icon: 'fal fa-truck-container',
    image: 'menu-icon/resources.svg'
  },
  {
    name: 'Events',
    route: 'fleet/operator/notification-management',
    icon: 'fal fa-exclamation-triangle',
  },
];

const FLEET_OWNER_ROUTES = [
  {
    name: 'Availability',
    route: 'fleet/owner/truck-driver-mapping',
    icon: 'fal fa-history',
  },
  {
    name: 'Driver History',
    route: 'fleet/owner/driver-history',
    icon: 'fal fa-history',
    disabled: true,
    isMarkForFunctionality: true
  },
  {
    name: 'Shipment Cost',
    route: 'fleet/owner/shipment-cost',
    icon: 'fal fa-chart-line',
    disabled: true,
    isMarkForFunctionality: true
  },
  {
    name: 'Resources',
    route: 'fleet/owner/fleet-management',
    // icon: 'fal fa-truck-container',
    image: 'menu-icon/resources.svg'
  },
  {
    name: 'Events',
    route: 'fleet/owner/notification-management',
    icon: 'fal fa-exclamation-triangle',
  },
];

const CUSTOMER_ROUTES = [
  {
    name: 'Dashboard',
    route: 'customer/dashboard',
    icon: 'fal fa-home'
  },
  // {
  //   name: 'Inventory',
  //   route: 'customer/inventory',
  //   icon: 'fal fa-inventory'
  // },
  // {
  //   name: 'Order',
  //   route: 'customer/order',
  //   icon: 'fal fa-boxes'
  // },
  {
    name: 'History',
    route: 'customer/history',
    icon: 'fal fa-history',
    isMarkForFunctionality: true,
    menus: [
      {
        name: 'Order',
        route: 'customer/history/order',
        icon: ''
      },
      {
        name: 'Inventory',
        route: 'customer/history/inventory',
        icon: ''
      },
    ]
  },
  {
    name: 'Events',
    route: 'customer/notification-management',
    icon: 'fal fa-exclamation-triangle',
  },
];

const ADMIN_ROUTES = [
  {
    name: 'Users',
    route: 'admin/user-management',
    icon: 'fal fa-users'
  },
  {
    name: 'Customers',
    route: 'admin/customer-management',
    icon: 'fal fa-gas-pump',
    menus: [
      {
        name: 'Tree View',
        route: 'admin/customer-management/tree-view',
        icon: ''
      },
      {
        name: 'Map View',
        route: 'admin/customer-management/map-view',
        icon: ''
      },
      {
        name: 'Inventory View',
        route: 'admin/customer-management/inventory-view',
        icon: ''
      },
    ]
  },
  {
    name: 'Haulers',
    route: 'admin/fleet-management',
    icon: 'fal fa-truck-container',
  },
  {
    name: 'Orders',
    route: 'admin/order-management',
    icon: 'fal fa-boxes',
  },
  {
    name: 'Quotas',
    route: 'admin/quota-management',
    // icon: 'fal fa-usd-square',
    image: 'menu-icon/Quota-01.svg'
  },
  {
    name: 'Events',
    route: 'admin/notification-management',
    icon: 'fal fa-exclamation-triangle',
  },
  {
    name: 'Systems',
    route: 'admin/system-information',
    icon: 'fal fa-cogs',
    menus: [
      {
        name: 'Activity Management',
        route: 'admin/system-information/activity-management',
        icon: ''
      },
      {
        name: 'Integration Services Status',
        route: 'admin/system-information/integration-services-status',
        icon: ''
      }
    ]
  },
  ...SETTING_ROUTES
];

const OTHER_ROUTES = {
  profile: {
    name: 'Profile',
    route: 'account/profile/{username}',
    icon: 'fal fa-user-cog'
  },
  help: {
    name: 'Help',
    route: 'account/help',
    icon: 'fal fa-question-circle'
  },
  back: {
    name: 'Back',
    route: '',
    icon: 'fal fa-long-arrow-left',
    none: true
  }
};

const MAIN_ROUTES = [
  {
    route: 'main',
  },
  {
    route: 'main/notification-management',
  },
  {
    name: 'Terminal',
    route: 'remote/admin',
    icon: 'fal fa-user-cog',
    subRoute: ADMIN_ROUTES
  },
  {
    name: 'Planner',
    icon: 'fal fa-user-clock',
    route: 'remote/terminal-planner',
    subRoute: PLANNER_ROUTES
  },
  {
    name: 'Hauler',
    route: 'remote/fleet/owner',
    // icon: 'fal fa-truck-moving',
    image: 'menu-icon/Truck-01.svg',
    subRoute: FLEET_OWNER_ROUTES
  },
  {
    name: 'Customer',
    route: 'remote/customer/',
    icon: 'fal fa-user-tie',
    subRoute: CUSTOMER_ROUTES
  },
];

export const AVAILABLE_ROUTES =
  {
    'main': MAIN_ROUTES,
    'terminal-planner': PLANNER_ROUTES,
    'terminal-operator': [
      {
        name: 'Operator',
        route: 'terminal-operator/home',
        icon: 'fal fa-home-lg'
      },
    ],
    'terminal': [
      {
        name: 'Home',
        route: 'terminal/home',
        icon: 'fal fa-home-lg'
      },
      {
        name: 'Bay Utilization Prediction',
        route: 'terminal/prediction',
        icon: 'fal fa-chart-bar'
      },
      {
        name: 'Loading Optimizer',
        route: 'terminal/loading/optimizer',
        icon: 'fal fa-cogs'
      },
      // {
      //   name: 'Station Map',
      //   route: 'terminal/station-map',
      //   icon: 'fal fa-gas-pump'
      // },
      // {
      //   name: 'Station List',
      //   route: 'terminal/station-list',
      //   icon: 'fal fa-gas-pump'
      // },
      // {
      //   name: 'Delivery Schedule',
      //   route: 'terminal/delivery/schedule',
      //   icon: 'fal fa-calendar-alt'
      // },
      // {
      //   name: 'Delivery Optimizer',
      //   route: 'terminal/delivery/optimizer',
      //   icon: 'fal fa-shipping-fast'
      // },
      // {
      //   name: 'Loading Optimizer',
      //   route: 'terminal/loading/optimizer',
      //   icon: 'fal fa-truck-loading'
      // },

    ],
    'truck-company-owner': FLEET_OWNER_ROUTES,
    'truck-company-operator': FLEET_OPERATION_ROUTES,
    'admin': ADMIN_ROUTES,
    'customer': CUSTOMER_ROUTES,
    'other': OTHER_ROUTES
  };

export enum CUSTOM_ROUTE_NAMES {
  PROFILE = 'profile',
  HELP = 'help'
}
