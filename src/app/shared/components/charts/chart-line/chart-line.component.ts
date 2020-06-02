import {AfterViewInit, Component, HostListener, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {COLOR_CODE} from '@shared/constants/color.constant';
import * as moment from 'moment';
import {DefaultChartComponent} from '@shared/models/default/default-component.model';

const Highcharts = require('highcharts');

@Component({
    selector: 'app-chart-line',
    templateUrl: './chart-line.component.html',
    styleUrls: ['./chart-line.component.scss']
})
export class ChartLineComponent extends DefaultChartComponent implements OnInit, OnChanges, AfterViewInit {
    @Input() container: string;
    @Input() unit: string;
    @Input() data: any;
    @Input() currentTimePoint: number;
    @Input() categories: any;
    @Input() formater: any;

    private _chart: any;

    constructor() {
        super();
        const self = this;
        super.onResize(() => {
            if (self._chart) {
                self._chart.destroy();
                setTimeout(() => {
                    self.loadLine(self.container, self.unit, self.data, self.categories, self.currentTimePoint, self.formater);
                });
            }
        });
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        const {data} = changes;
        if (data && data.currentValue && data.currentValue.length > 0) {
            if (!data.firstChange) {
                this._chart.destroy();
                this.loadLine(this.container, this.unit, this.data, this.categories, this.currentTimePoint, this.formater);
            }
        }
    }

    ngAfterViewInit() {
        if (!!this.data) {
            this.loadLine(this.container, this.unit, this.data, this.categories, this.currentTimePoint, this.formater);
        }
    }

    updateChartData(data: any[]) {
        data.forEach((d, index) => {
            this._chart.series[index].update(d, false);
        });
        this._chart.redraw();
    }

    loadLine(container, unit = '', data = [], categories = [], currentTimePoint = 1.5, formater = {}) {
        if (!data.length) {
            return;
        }

        data.forEach((el, index) => {
            if (!el['color']) {
                el['color'] = COLOR_CODE[Object.keys(COLOR_CODE)[index]];
            }
        });

        this._chart = Highcharts.chart(container, {
            chart: {
                scrollablePlotArea: {
                    minWidth: 500,
                    scrollPositionX: currentTimePoint
                }
            },
            xAxis: {
                // categories: categories,
                type: 'datetime',
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
                    label: {
                        text: 'current time',
                        style: {
                            'color': COLOR_CODE.DARK.AXIS_TEXT
                        }
                    }
                }],
            },

            yAxis: {
                gridLineWidth: 1,
                gridLineColor: COLOR_CODE.DARK.AXIS,
            },

            tooltip: {
                formatter: function () {
                    if (!!formater['toolTipFormater'] && !!formater['toolTipFormater'][this.series.name]) {
                        return formater['toolTipFormater'][this.series.name].call(this, this.point);
                    }
                    return '<b>' + moment(this.x).format('YYYY-MM-DD (HH:mm:ss)') + '</b><br/>' +
                        this.series.name + ': ' + this.y + '<br/>';
                }
            },

            series: data,

            plotOptions: {
                series: {
                    dataLabels: {
                        formatter: function () {
                            if (!!formater['labelValueFormater'] && !!formater['labelValueFormater'][this.series.name]) {
                                return formater['labelValueFormater'][this.series.name].call(this, this.point);
                            }
                            if (this.y !== 0) {
                                return this.y;
                            }
                        }
                    }
                }
            },

            // responsive: {
            //     rules: [{
            //         condition: {
            //             maxWidth: 500
            //         },
            //         chartOptions: {
            //             legend: {
            //                 layout: 'horizontal',
            //                 align: 'center',
            //                 verticalAlign: 'bottom'
            //             }
            //         }
            //     }]
            // }

        });
    }

}
