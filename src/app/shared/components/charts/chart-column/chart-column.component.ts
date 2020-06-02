import {Component, HostListener, Input, OnInit, SimpleChanges} from '@angular/core';
import {DefaultChartComponent} from '@shared/models/default/default-component.model';

const Highcharts = require('highcharts');

@Component({
    selector: 'app-chart-column',
    templateUrl: './chart-column.component.html',
    styleUrls: ['./chart-column.component.scss']
})
export class ChartColumnComponent extends DefaultChartComponent implements OnInit {
    @Input() container: string;
    @Input() categories: string[];
    @Input() unit: string;
    @Input() data: any;
    @Input() legendWidth: number = 120;

    private _chart: any;

    constructor() {
        super();
        const self = this;
        super.onResize(() => {
            if (self._chart) {
                self._chart.destroy();
                setTimeout(() => {
                    self.loadColumn(self.container, self.data, self.categories, self.legendWidth);
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
                this.updateChartData(this.data);
            }
        }
    }

    ngAfterViewInit() {
        if (!!this.data) {
            this.loadColumn(this.container, this.data, this.categories, this.legendWidth);
        }
    }

    updateChartData(data: any[]) {
        data.forEach((d, index) => {
            this._chart.series[index].update(d, false);
        });
        this._chart.redraw();
    }

    loadColumn(container, data = [], categories = [], legendWidth) {
        this._chart = Highcharts.chart(container, {
            chart: {
                type: 'column',
                ignoreHiddenSeries: true,
                marginRight: legendWidth
            },
            xAxis: {
                categories,
            },
            yAxis: {
                title: {
                    text: ''
                },
                labels: {
                    format: '{value}'
                },
            },
            plotOptions: {
                column: {
                    grouping: false,
                    pointPlacement: null,
                },
                series: {
                    pointWidth: 20
                }
            },
            legend: {
                align: 'right',
                verticalAlign: 'top',
                layout: 'vertical',
                x: 0,
                y: -10
            },
            tooltip: {
                shared: true
            },
            series: data
        });
    }
}
