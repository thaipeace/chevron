export const MAP_STYLES = [{
    'featureType': 'administrative',
    'elementType': 'geometry',
    'stylers': [{'visibility': 'off'}]
}, {'featureType': 'landscape.natural', 'elementType': 'geometry', 'stylers': [{'visibility': 'off'}]}, {
    'featureType': 'poi',
    'stylers': [{'visibility': 'off'}]
}, {'featureType': 'road', 'elementType': 'geometry.fill', 'stylers': [{'color': '#c0c0c0'}]}, {
    'featureType': 'road',
    'elementType': 'labels.icon',
    'stylers': [{'visibility': 'off'}]
}, {'featureType': 'road.highway', 'elementType': 'geometry.fill', 'stylers': [{'weight': 2}]}, {
    'featureType': 'road.highway',
    'elementType': 'geometry.stroke',
    'stylers': [{'visibility': 'off'}]
}, {'featureType': 'transit', 'stylers': [{'visibility': 'off'}]}];

export const MAP_INFO_WINDOWS = {
    STATION: 'iw-station',
    TRUCK: 'iw-truck',
    EVENT: 'iw-event'
};
