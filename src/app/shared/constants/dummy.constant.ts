export const HISTORY_ORDERS = [{
  'station': 1,
  'no': 1,
  'name': 'E5',
  'quantity': 3543,
  'truck': '.NCN 4346',

  'date': '10/15/2018'
}, {
  'station': 1,
  'no': 2,
  'name': 'D',
  'quantity': 1225,
  'truck': '.NCN 4346',

  'date': '3/15/2019'
}, {
  'station': 1,
  'no': 3,
  'name': 'E5',
  'quantity': 6099,
  'truck': '.NCN 4346',

  'date': '5/17/2018'
}, {
  'station': 1,
  'no': 4,
  'name': 'D',
  'quantity': 4213,
  'truck': '.NCN 4346',

  'date': '2/7/2019'
}, {
  'station': 2,
  'no': 5,
  'name': 'E5',
  'quantity': 5125,
  'truck': '.NCN 4346',

  'date': '11/30/2018'
}, {
  'station': 2,
  'no': 6,
  'name': 'D',
  'quantity': 4085,
  'truck': '.NCN 4346',

  'date': '10/28/2018'
}, {
  'station': 2,
  'no': 7,
  'name': '95',
  'quantity': 7551,
  'truck': '.NCN 4346',

  'date': '9/2/2018'
}, {
  'station': 2,
  'no': 8,
  'name': '95',
  'quantity': 9765,
  'truck': '.NCN 4346',

  'date': '3/24/2018'
}, {
  'station': 2,
  'no': 9,
  'name': '95',
  'quantity': 4981,
  'truck': '.NCN 4346',

  'date': '8/10/2018'
}, {
  'station': 2,
  'no': 10,
  'name': '95',
  'quantity': 7138,
  'truck': '.NCN 4346',

  'date': '3/9/2019'
}];
export const CURRENT_ORDERS =
  [{
    'name': 'Diesel',
    'status': false
  }, {
    'name': 'Diesel',
    'status': false
  }, {
    'name': 'Diesel',
    'status': true
  }, {
    'name': 'Diesel',
    'status': true
  }, {
    'name': 'Diesel',
    'status': false
  }, {
    'name': 'Diesel',
    'status': false
  }, {
    'name': 'Diesel',
    'status': true
  }, {
    'name': 'Diesel',
    'status': true
  }, {
    'name': 'Diesel',
    'status': false
  }, {
    'name': 'Diesel',
    'status': true
  }];

const STATUS = {
  AVAILABLE: 'Available',
  UN_AVAILABLE: 'Unavailable'
};

const PERFORMANCE = {
  GOOD: 'Good',
  AVERAGE: 'Average',
  BAD: 'Bad'
};

export const TRUCKS =
  [{
    'plate': 'WBAWR33557P353664',
    'capacity': 100,
    'status': STATUS.UN_AVAILABLE,
    'performance': PERFORMANCE.GOOD,
    'driver': [1, 2]
  }, {
    'plate': '4T1BF1FK4EU574912',
    'capacity': 100,
    'status': STATUS.AVAILABLE,
    'performance': PERFORMANCE.AVERAGE,
    'driver': null
  }, {
    'plate': '2HNYD28748H441376',
    'capacity': 100,
    'status': STATUS.UN_AVAILABLE,
    'performance': PERFORMANCE.AVERAGE,
    'driver': [3, 4]
  }, {
    'plate': '3D73M4HL3BG454352',
    'capacity': 100,
    'status': STATUS.AVAILABLE,
    'performance': PERFORMANCE.GOOD,
    'driver': null
  }, {
    'plate': 'JN8CS1MU3FM848941',
    'capacity': 100,
    'status': STATUS.AVAILABLE,
    'performance': PERFORMANCE.GOOD,
    'driver': null
  }, {
    'plate': '3D4PG9FG3BT599942',
    'capacity': 100,
    'status': STATUS.UN_AVAILABLE,
    'performance': PERFORMANCE.GOOD,
    'driver': [5, 6]
  }, {
    'plate': 'JH4KB16508C200428',
    'capacity': 100,
    'status': STATUS.AVAILABLE,
    'performance': PERFORMANCE.BAD,
    'driver': null
  }, {
    'plate': '5N1AN0NW5DN515681',
    'capacity': 100,
    'status': STATUS.AVAILABLE,
    'performance': PERFORMANCE.GOOD,
    'driver': null
  }, {
    'plate': '1FTNF1E81AK508604',
    'capacity': 100,
    'status': STATUS.AVAILABLE,
    'performance': PERFORMANCE.GOOD,
    'driver': null
  }, {
    'plate': '1FTWW3A54AE603846',
    'capacity': 100,
    'status': STATUS.AVAILABLE,
    'performance': PERFORMANCE.GOOD,
    'driver': null
  }];

export const DRIVERS =
  [{
    'id': 1,
    'name': 'Deirdre Chaucer',
    'address': '93330 Elmside Junction',
    'phone': '(408) 4661126',
    'performance': PERFORMANCE.GOOD,
    'status': null
  }, {
    'id': 2,
    'name': 'Thedrick Fawltey',
    'address': '0 Nobel Parkway',
    'phone': '(719) 9599344',
    'performance': PERFORMANCE.GOOD,
    'status': null
  }, {
    'id': 3,
    'name': 'Desiri Bidgood',
    'address': '23870 Stuart Hill',
    'phone': '(210) 6286248',
    'performance': PERFORMANCE.GOOD,
    'status': null
  }, {
    'id': 4,
    'name': 'Francis Clinch',
    'address': '342 Annamark Court',
    'phone': '(355) 6290662',
    'performance': PERFORMANCE.GOOD,
    'status': null
  }, {
    'id': 5,
    'name': 'Javier Ramshay',
    'address': '3334 Montana Street',
    'phone': '(739) 1647289',
    'performance': PERFORMANCE.GOOD,
    'status': null
  }, {
    'id': 6,
    'name': 'Penny Edlington',
    'address': '99615 Holmberg Point',
    'phone': '(285) 4857852',
    'performance': PERFORMANCE.GOOD,
    'status': null
  }, {
    'id': 7,
    'name': 'Yanaton Boyson',
    'address': '1 Johnson Point',
    'phone': '(792) 6998347',
    'performance': PERFORMANCE.GOOD,
    'status': null
  }, {
    'id': 8,
    'name': 'Jarib Blitz',
    'address': '08 Ridge Oak Point',
    'phone': '(789) 4524390',
    'performance': PERFORMANCE.GOOD,
    'status': null
  }, {
    'id': 9,
    'name': 'Aileen Armand',
    'address': '82904 Aberg Center',
    'phone': '(688) 5984155',
    'performance': PERFORMANCE.GOOD,
    'status': null
  }, {
    'id': 10,
    'name': 'Krysta Pinwell',
    'address': '6 Gulseth Pass',
    'phone': '(806) 4419299',
    'performance': PERFORMANCE.GOOD,
    'status': null
  }];
