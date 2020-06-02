export interface ILocationMarker {
    position: number[] | string;
    icon: ILocationMarkerIcon;
}

export interface ILocationMarkerIcon {
    url: string;
    anchor: number[];
    size: number[];
    scaledSize: number[];
}

export function createLocationMarkerIconVM(url: string, anchor: number[], size: number[], scaledSize: number[]) {
    return { url, anchor, size, scaledSize };
}

export function createDefaultLocationMarkerIconVM(url: string) {
    return { url, anchor: [16, 16], size: [32, 32], scaledSize: [32, 32] };
}

export function createLocationMarkerVM(position: number[] | string, icon: ILocationMarkerIcon) {
    return { position, icon };
}
