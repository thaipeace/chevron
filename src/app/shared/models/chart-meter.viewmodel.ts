export interface IChartMeterViewModel {
    name: string;
    title: string;
    unit: string;
    min: number;
    max: number;
    value: number;
    valueName: string;
    color?: string;
    random: boolean;
    plotBandRange: number[][];
}
