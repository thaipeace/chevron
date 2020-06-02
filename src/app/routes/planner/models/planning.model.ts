export interface IPlanningModel {
    id: number;
    truck: {
        plate: string;
        capacity: number;
    };
    trips: IPlanningTripModel[];
}

export interface IPlanningTripModel {
    tripNo: number;
    ptoCheck: number[];
    stations: IPlanningStationModel[];
}

export interface IPlanningStationModel {
    id: number;
    name: string;
    gasValues?: number[];
}

export const PLANNING_DATA: IPlanningModel[] = [{
    id: 1,
    truck: { plate: '.NCN 4346', capacity: 46000 },
    trips: [{
        tripNo: 1,
        ptoCheck: [6.0, 12.6, 19.6],
        stations: [{
            id: 1,
            name: 'Bintang Cheng (45)',
            gasValues: [0, 32.2, 14.0, 0]
        }],
    }, {
        tripNo: 2,
        ptoCheck: [6.0, 12.6, 19.6],
        stations: [{
            id: 1,
            name: 'Bintang Cheng (45)',
            gasValues: [0, 32.2, 14.0, 0]
        }]
    }]
}, {
    id: 2,
    truck: { plate: '.NCN 4346', capacity: 46000 },
    trips: [{
        tripNo: 4,
        ptoCheck: [6.0, 12.6, 19.6],
        stations: [{
            id: 1,
            name: 'Bintang Cheng (45)',
            gasValues: [0, 32.2, 14.0, 0]
        }]
    }, {
        tripNo: 5,
        ptoCheck: [6.0, 12.6, 19.6],
        stations: [{
            id: 1,
            name: 'Bintang Cheng (45)',
            gasValues: [0, 32.2, 14.0, 0]
        }]
    }]
}];

export const PLANNING_STATION_DATA: IPlanningStationModel[] = [{
    id: 1,
    name: 'Bintang Cheng (45)'
}, {
    id: 2,
    name: 'PNK LKIM Endau'
}, {
    id: 3,
    name: '.Super Hawaii Kluang'
}, {
    id: 4,
    name: '.Bt Empat Kluang'
}, {
    id: 5,
    name: '.Kee Fatt Skudai'
}, {
    id: 6,
    name: '.All Spark Skudai'
}, {
    id: 7,
    name: '.Muza Star Skudai'
}, {
    id: 8,
    name: '.Pagoh Syabas Muar'
}, {
    id: 9,
    name: 'Hartamas Rompin Pahan'
}, {
    id: 10,
    name: '.Ria Azimat KulaiJaya'
}, {
    id: 11,
    name: '.Azza Star Ent Senai'
}];
