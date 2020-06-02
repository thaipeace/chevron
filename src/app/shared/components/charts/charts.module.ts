import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { COLOR_CODE } from '@shared/constants/color.constant';
import { ChartLineComponent } from './chart-line/chart-line.component';
import { ChartColumnRangeComponent } from './chart-column-range/chart-column-range.component';
import { ChartColumnComponent } from './chart-column/chart-column.component';
import { ChartColumnLineCombineComponent } from './chart-column-line-combine/chart-column-line-combine.component';
import { DirectivesModule } from '@app/shared/directives/directives.module';
import { ChartColumnOverlayCombineComponent } from './chart-column-overlay-combine/chart-column-overlay-combine.component';
import { ChartGaugeComponent } from './chart-gauge/chart-gauge.component';
import { ChartMeterComponent } from './chart-meter/chart-meter.component';
import { ChartPieComponent } from './chart-pie/chart-pie.component';
import { ChartColumnOverlayComponent } from './chart-column-overlay/chart-column-overlay.component';
import { ChartColumnLineComponent } from './chart-column-line/chart-column-line.component';
import { ChartColumnLineDailyComponent } from './chart-column-line-daily/chart-column-line-daily.component';
import { ChartSplineComponent } from './chart-spline/chart-spline.component';
import { ChartDeliveryWindowComponent } from './chart-delivery-window/chart-delivery-window.component';

// highchart defaults

const Highcharts = require('highcharts');
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/solid-gauge')(Highcharts);
require('highcharts/modules/draggable-points')(Highcharts);

Highcharts.setOptions({
    chart: {
        backgroundColor: 'transparent',
    },
    exporting: {
        enabled: false
    },
    title: {
        text: ''
    },
    credits: {
        enabled: false
    },
    xAxis: {
        lineColor: COLOR_CODE.DARK.AXIS,
        labels: {
            style: {
                'font-size': '10px',
                'color': COLOR_CODE.DARK.AXIS_TEXT
            }
        }
    },
    yAxis: {
        gridLineWidth: 0,
        allowDecimals: false,
        // min: 0,
        title: {
            text: ''
        },
        labels: {
            style: {
                'font-size': '10px',
                'color': COLOR_CODE.DARK.AXIS_TEXT
            }
        }
    },
    legend: {
        itemMarginBottom: 8,
        itemHoverStyle: {
            'color': COLOR_CODE.BLUE,
        },
        itemHiddenStyle: {
            'color': COLOR_CODE.LIGHT_BLUE,
        },
        itemStyle: {
            'color': COLOR_CODE.DARK.LEGEND_TEXT,
            'font-size': '12px',
            'font-weight': 'normal',
        }
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: false
            },
            showInLegend: true,
            borderColor: COLOR_CODE.DARK.BORDER
        },
        spline: {
            dataLabels: {
                enabled: true,
                style: {
                    'textOutline': 'none',
                    'color': COLOR_CODE.DARK.AXIS_TEXT
                },
                y: -5
            },
            marker: {
                fillColor: COLOR_CODE.DARK.SPLINE,
            }
        },
        line: {
            dataLabels: {
                enabled: true,
                style: {
                    'textOutline': 'none',
                    'color': COLOR_CODE.DARK.AXIS_TEXT
                },
                y: 0
            },
        },
        columnrange: {
            color: COLOR_CODE.DARK.COLUMN_RANGE,
            borderWidth: 0,
            dataLabels: {
                enabled: true,
                style: {
                    'textOutline': 'none',
                    'color': COLOR_CODE.TOPAZ
                },
                y: 0
            },
        }
    },
});

@NgModule({
    declarations: [
        ChartGaugeComponent,
        ChartMeterComponent,
        ChartPieComponent,
        ChartColumnOverlayComponent,
        ChartColumnLineComponent,
        ChartLineComponent,
        ChartColumnRangeComponent,
        ChartColumnComponent,
        ChartColumnLineCombineComponent,
        ChartColumnOverlayCombineComponent,
        ChartColumnLineDailyComponent,
        ChartSplineComponent,
        ChartDeliveryWindowComponent
    ],
    imports: [
        CommonModule,
        DirectivesModule
    ],
    exports: [
        ChartMeterComponent,
        ChartPieComponent,
        ChartGaugeComponent,
        ChartColumnOverlayComponent,
        ChartColumnLineComponent,
        ChartLineComponent,
        ChartColumnRangeComponent,
        ChartColumnComponent,
        ChartColumnLineCombineComponent,
        ChartColumnOverlayCombineComponent,
        ChartColumnLineDailyComponent,
      ChartSplineComponent,
      ChartDeliveryWindowComponent
    ]
})
export class ChartsModule {
}
