import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { COLOR_CODE } from '@shared/constants/color.constant';
import * as _ from 'lodash';

const Highcharts = require('highcharts');

@Component({
    selector: 'app-chart-column-overlay',
    templateUrl: './chart-column-overlay.component.html',
    styleUrls: ['./chart-column-overlay.component.scss']
})
export class ChartColumnOverlayComponent implements OnInit {
    @Input() container: string;
    @Input() unit: string;
    @Input() data: any;
    @Input() currentTimePoint: any;
    @Input() categories: any[];

    private _chart: any;

    constructor() {
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        const { data } = changes;
        if (data && data.currentValue && data.currentValue.length > 0) {
            if (!data.firstChange)
                this.updateChartData(this.data);
        }
    }

    ngAfterViewInit() {
        if (!!this.data) {
            this.loadColumn(this.container, this.unit, this.data, this.categories, this.currentTimePoint);
        }
    }

    updateChartData(data: any[]) {
        data.forEach((d, index) => {
            this._chart.series[index].update(d, false);
        });
        this._chart.redraw();
    }

    loadColumn(container, unit = '', data = [],
        categories = ['10:00 AM', '11:00 AM', '12:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'],
        currentTimePoint = 1.5) {
        if (!data.length) {
            return;
        }

        // add default color for columns
        let placementRange = -0.30;
        const noOfMemberInGroup = _.filter(data, { type: 'column' }).length;
        const noOfGroup = categories.length;

        for (let i = 0; i < data.length; i += 2) {
            data[i]['color'] = COLOR_CODE[Object.keys(COLOR_CODE)[i / 2]].replace('1)', '0.5)');
            data[i] = {
                ...data[i],
                pointWidth: 30,
                pointPlacement: placementRange + Math.abs(placementRange * 2) / (noOfMemberInGroup - 1) * i / 2,
                showInLegend: false,
            };
            data[i + 1]['color'] = COLOR_CODE[Object.keys(COLOR_CODE)[i / 2]];
            data[i + 1] = {
                ...data[i + 1],
                pointWidth: 14,
                pointPlacement: placementRange + Math.abs(placementRange * 2) / (noOfMemberInGroup - 1) * i / 2,
            };
        }

        const chartConfig = {
            renderTo: container,
            scrollablePlotArea: {
                minWidth: noOfGroup * noOfMemberInGroup * 45,
                scrollPositionX: currentTimePoint
            }
        };

        // const plotBandsOptions = plotBands ? {
        //     plotBands: [{ // visualize the weekend
        //         from: -0.5,
        //         to: 1.5,
        //         color: COLOR_CODE.DARK.PLOT_BAND
        //     }],
        //     plotLines: [{
        //         color: COLOR_CODE.DARK.AXIS, // Color value
        //         dashStyle: 'solid', // Style of the plot line. Default to solid
        //         value: 1.5, // Value of where the line will appear
        //         width: 2, // Width of the line
        //         label: {
        //             text: 'current time',
        //             style: {
        //                 'color': COLOR_CODE.DARK.AXIS_TEXT
        //             }
        //         }
        //     }],
        // } : {};

        this._chart = Highcharts.chart(container, {
            chart: chartConfig
            ,
            xAxis: {
                categories,
                plotBands: [{ // visualize the weekend
                    from: -0.5,
                    to: currentTimePoint,
                    color: COLOR_CODE.DARK.PLOT_BAND
                }],
                plotLines: [{
                    color: COLOR_CODE.DARK.AXIS, // Color value
                    dashStyle: 'solid', // Style of the plot line. Default to solid
                    value: currentTimePoint, // Value of where the line will appear
                    width: 2, // Width of the line
                    zIndex: 2,
                    label: {
                        text: 'current time',
                        // prevent text overlap if plotline is end of the chart
                        x: currentTimePoint >= (noOfGroup - 1) ? -15 : 5,
                        style: {
                            'color': COLOR_CODE.DARK.AXIS_TEXT
                        }
                    }
                }],
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.x + '</b><br/>' +
                        this.series.name + ': ' + this.y + '<br/>';
                    //   return this.points.reduce(function (s, point) {
                    //     return s + '<br/>' + point.series.name + ': ' +
                    //         point.y + 'm';
                    // }, '<b>' + this.x + '</b>');
                },
                // shared: true,
            },
            plotOptions: {
                column: {
                    grouping: false,
                    shadow: false,
                    borderWidth: 0
                },
                series: {
                    cropThreshold: 100
                },
            },
            series: data
        });
    }
}
