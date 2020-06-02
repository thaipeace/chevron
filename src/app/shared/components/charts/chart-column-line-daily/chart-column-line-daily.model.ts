export interface IChartColumnLineDailyModel {
    columns: IChartColumnLineDailyDataModel[];
    spLine: IChartColumnLineDailyDataModel;
    category: string[];
}

export interface IChartColumnLineDailyDataModel {
    name: string;
    color: string;
    data: number[];
}
