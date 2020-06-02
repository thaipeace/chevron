import { Component, Input, OnInit, AfterViewInit, SimpleChanges } from '@angular/core';
import { COLOR_CODE } from '@shared/constants/color.constant';

const Highcharts = require('highcharts');

@Component({
    selector: 'app-chart-column-range',
    templateUrl: './chart-column-range.component.html',
    styleUrls: ['./chart-column-range.component.scss']
})
export class ChartColumnRangeComponent implements OnInit, AfterViewInit {
    @Input() container: string;
    @Input() unit: string;
    @Input() data: any;

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
            this.loadColumnRange(this.container, this.unit, this.data);
        }
    }

    updateChartData(data: any[]) {
        data.forEach((d, index) => {
            this._chart.series[index].update(d, false);
        });
        this._chart.redraw();
    }

    loadColumnRange(container, unit = '', data = []) {
        if (!data.length) {
            return;
        }

        this._chart = Highcharts.chart(container, {
            chart: {
                type: 'columnrange',
                inverted: true,
            },
            xAxis: {
                categories: ['ARB Process', 'ARB Storage', 'ISO Tank', 'Rail Cars'],
            },

            yAxis: {
                type: 'datetime',
                min: Date.UTC(2019, 1, 8, 1, 1),
                max: Date.UTC(2019, 1, 10, 10, 1),
                gridLineWidth: 1,
                gridLineColor: COLOR_CODE.DARK.AXIS,
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        format: '{y:%Y-%m-%d-%H}h'
                    },
                    dragDrop: {
                        draggableX: false,
                        draggableY: true,
                        // dragMinY: Date.UTC(2019, 1, 8, 1, 1),
                        // dragMaxY: Date.UTC(2019, 1, 10, 7, 1),
                        liveRedraw: false,
                    },
                    point: {
                        events: {
                            drop: function (e) {
                            }
                        }
                    }
                },
            },

            tooltip: {
                enabled: true,
                positioner: function (labelWidth, labelHeight, point) {
                    var tooltipX = point.plotX - 30;
                    var tooltipY = point.plotY - 40;
                    return {
                        x: tooltipX,
                        y: tooltipY
                    };
                }
            },

            legend: {
                enabled: false
            },

            series: data

        });
    }

}
