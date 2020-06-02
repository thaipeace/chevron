import { Component, Input, OnInit, SimpleChanges, OnChanges, AfterViewInit } from '@angular/core';
import { COLOR_CODE } from '@shared/constants/color.constant';
import * as _ from 'lodash';

const Highcharts = require('highcharts');

@Component({
    selector: 'app-chart-column-line',
    templateUrl: './chart-column-line.component.html',
    styleUrls: ['./chart-column-line.component.scss']
})
export class ChartColumnLineComponent implements OnInit, OnChanges, AfterViewInit {
    @Input() container: string;
    @Input() unit: string;
    @Input() data: any;
    @Input() currentTimePoint: any;
    @Input() categories: any[];

    private _chart: any;

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        const { data } = changes;
        if (data && data.currentValue && data.currentValue.length > 0) {
            if (!data.firstChange) {
                this.updateChartData(this.data);
            }
        }
    }

    ngAfterViewInit() {
        if (!!this.data) {
            this.loadColumnLine(this.container, this.unit, this.data, this.categories, this.currentTimePoint);
        }
    }

    updateChartData(data: any[]) {
        data.forEach((d, index) => {
            this._chart.series[index].update(d, false);
        });
        this._chart.redraw();
    }

    loadColumnLine(container, unit = '', data = [],
        categories = ['10:00 AM', '11:00 AM', '12:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'],
        currentTimePoint = 1.5) {
        if (!data.length) {
            return;
        }

        // add default color for columns
        _.filter(data, { type: 'column' })
            .forEach((el, index) => {
                if (!el['color']) {
                    el['color'] = COLOR_CODE[Object.keys(COLOR_CODE)[index]];
                }
            });

        const noOfMemberInGroup = _.filter(data, { type: 'column' }).length;
        const noOfGroup = categories.length;

        const chartConfig = {
            renderTo: container,
            scrollablePlotArea: {
                minWidth: noOfGroup * noOfMemberInGroup * 45,
                scrollPositionX: currentTimePoint
            }
        };

        this._chart = Highcharts.chart(
            {
                chart: chartConfig,
                xAxis: {
                    categories,
                    plotBands: [{ // visualize the weekend
                        from: -0.5,
                        to: currentTimePoint,
                        color: COLOR_CODE.DARK.PLOT_BAND
                    }],
                    // min: 0,
                    // max: 4,
                    scrollbar: {
                        enabled: true
                    },
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
                yAxis: [{
                    labels: {
                        format: '{value} ' + unit
                    },
                    plotLines: [{
                        color: COLOR_CODE.DARK.AXIS,
                        width: 1,
                        value: 0
                    }],
                }],
                tooltip: {
                    formatter: function () {
                        return '<b>' + this.x + '</b><br/>' +
                            this.series.name + ': ' + this.y + '<br/>';
                    }
                },

                plotOptions: {
                    column: {
                        borderColor: COLOR_CODE.DARK.BORDER,
                        pointWidth: 30,
                    },
                    series: {
                        groupPadding: 0.05,
                        pointPadding: 0.05,
                    }
                },
                series: data
            },
            () => {
                setTimeout(() => {
                    // this.scrollbarService.applyScroll('.highcharts-scrolling');
                }, 1000);
            });
    }

    refreshSize(newWidth, newHeight) {
        if (!!this._chart) {
            this._chart.setSize(newWidth, newHeight);
        }
    }

}
