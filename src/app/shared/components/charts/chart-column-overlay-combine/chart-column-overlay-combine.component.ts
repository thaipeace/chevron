import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { COLOR_CODE } from '@shared/constants/color.constant';

const Highcharts = require('highcharts');

@Component({
    selector: 'app-chart-column-overlay-combine',
    templateUrl: './chart-column-overlay-combine.component.html',
    styleUrls: ['./chart-column-overlay-combine.component.scss']
})
export class ChartColumnOverlayCombineComponent implements OnInit, OnChanges {
    @Input() container: string;
    @Input() unit: string;
    @Input() data: any;
    @Input() plotBands: boolean = true;
    @Output() onRangeAdjusted = new EventEmitter<any>();

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
            this.loadColumn(this.container, this.unit, this.data, this.plotBands);
        }
    }

    updateChartData(data: any[]) {
        data.forEach((d, index) => {
            this._chart.series[index].update(d, false);
        });
        this._chart.redraw();
    }

    loadColumn(container, unit = '', data = [], plotBands) {
        if (!data.length) {
            return;
        }
        let noOfMember = (data.length - 3) / 2;
        let noOfGroup = data[0].data.length;
        let placementRange = -0.30;
        for (let i = 0; i < data.length; i += 2) {
            if (data[i]['type'] !== 'column') {
                continue;
            }

            data[i]['color'] = COLOR_CODE[Object.keys(COLOR_CODE)[i / 2]].replace('1)', '0.5)');
            data[i] = {
                ...data[i],
                pointWidth: 30,
                pointPlacement: placementRange + Math.abs(placementRange * 2) / (noOfMember - 1) * i / 2,
                showInLegend: false,
                dragDrop: {
                    draggableY: false
                }
            };

            data[i + 1]['color'] = COLOR_CODE[Object.keys(COLOR_CODE)[i / 2]];
            data[i + 1] = {
                ...data[i + 1],
                pointWidth: 14,
                pointPlacement: placementRange + Math.abs(placementRange * 2) / (noOfMember - 1) * i / 2,
                dragDrop: {
                    draggableY: false
                }
            };

            const name = `${data[i + 1]['name']} Point`;
            let index = data.findIndex(d => d['name'] === name);
            if (index > -1) {
                data[index] = {
                    ...data[index],
                    pointPlacement: placementRange + Math.abs(placementRange * 2) / (noOfMember - 1) * i / 2,
                    showInLegend: false,
                };
            }
        }

        const isSingleValue = data[0]['data'].length == 1;

        if (isSingleValue) {
            data[0]['data'] = [
                ...data[0]['data'],
                0
            ];
        }

        const plotBandsOptions = plotBands ? {
            plotBands: [{ // visualize the weekend
                from: -0.5,
                to: 1.5,
                color: COLOR_CODE.DARK.PLOT_BAND
            }],
            plotLines: [{
                color: COLOR_CODE.DARK.AXIS, // Color value
                dashStyle: 'solid', // Style of the plot line. Default to solid
                value: 1.5, // Value of where the line will appear
                width: 2, // Width of the line
                label: {
                    text: 'current time',
                    style: {
                        'color': COLOR_CODE.DARK.AXIS_TEXT
                    }
                }
            }],
        } : {};

        const self = this;

        this._chart = Highcharts.chart(container, {
            chart: {
                //type: 'column',
                scrollablePlotArea: {
                    minWidth: noOfGroup * noOfMember * 65,
                    scrollPositionX: 1.5
                },
                marginRight: isSingleValue ? -350 : 0
            },
            xAxis: {
                categories: [''],
                ...plotBandsOptions
            },
            tooltip: {
                formatter: function () {
                    if (this.series.name.indexOf('Point') > -1) {
                        return false;
                    }
                    return '<b>' + this.x + '</b><br/>' +
                        this.series.name + ': ' + this.y + '<br/>';
                },
            },
            dataLabels: {
                enabled: true,
                formatter: function () {
                    return Highcharts.numberFormat(this.y, 0);
                },
            },
            plotOptions: {
                column: {
                    grouping: false,
                    shadow: false,
                    borderWidth: 0
                },
                series: {
                    cropThreshold: 100,
                    marker: {
                        symbol: 'circle',
                        fillColor: '#FFFFFF',
                        lineWidth: 0,
                        lineColor: null
                    },
                    dataLabels: {
                        color: '#FFFFFF',
                    },
                    point: {
                        events: {
                            drop: function (e) {
                                self._onRangeChanged(e.newPoint['y'], e.target['tagName'], e.target['maxValue']);
                            }
                        }
                    }
                },
            },
            series: data
        });
    }

    private _onRangeChanged(value, tag, maxValue) {
        this.onRangeAdjusted.emit({ value, tag, maxValue });
    }
}
