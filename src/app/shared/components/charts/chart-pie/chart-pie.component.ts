import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { COLOR_CODE } from '@shared/constants/color.constant';

const Highcharts = require('highcharts');

@Component({
    selector: 'app-chart-pie',
    templateUrl: './chart-pie.component.html',
    styleUrls: ['./chart-pie.component.scss']
})
export class ChartPieComponent implements OnInit {
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
            this.loadPie(this.container, this.unit, this.data);
        }
    }

    updateChartData(data: any[]) {
        data.forEach((d, index) => {
            this._chart.series[index].update(d, false);
        });
        this._chart.redraw();
    }

    loadPie(container, unit = '', data = {}) {
        data['data'].forEach((el, index) => {
            el['color'] = COLOR_CODE[Object.keys(COLOR_CODE)[index]];
        });

        Highcharts.chart(container, {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}' + unit + '</b>'
            },
            series: [data]
        });
    }
}
