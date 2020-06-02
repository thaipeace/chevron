export interface ITerminalModeModel {
    id: number;
    name: string;
    terminals: ITerminalModel[];
}

export interface ITerminalModel {
    id: number;
    name: string;
}

export const TERMINAL_DATA: ITerminalModel[] = [{
    id: 1,
    name: 'A Terminal'
}, {
    id: 2,
    name: 'B Terminal'
}, {
    id: 3,
    name: 'C Terminal'
}, {
    id: 4,
    name: 'D Terminal'
}, {
    id: 5,
    name: 'E Terminal'
}, {
    id: 6,
    name: 'F Terminal'
}, {
    id: 7,
    name: 'G Terminal'
}];

export const MODE_DATA: ITerminalModeModel[] = [{
    id: 1,
    name: 'Regular',
    terminals: [TERMINAL_DATA[0], TERMINAL_DATA[1]]
}, {
    id: 2,
    name: 'Price Up',
    terminals: [TERMINAL_DATA[2], TERMINAL_DATA[3], TERMINAL_DATA[4]]
}, {
    id: 3,
    name: 'Price Down',
    terminals: []
}, {
    id: 4,
    name: 'Sales Up',
    terminals: []
}, {
    id: 5,
    name: 'Sales Down',
    terminals: [TERMINAL_DATA[6]]
}];

