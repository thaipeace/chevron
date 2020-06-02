import {Component, OnInit, Input, SimpleChanges, OnChanges, AfterViewInit} from '@angular/core';
import {COLOR_CODE} from '@app/shared/constants/color.constant';
import * as _ from 'lodash';

const Highcharts = require('highcharts');

@Component({
  selector: 'app-chart-column-line-combine',
  templateUrl: './chart-column-line-combine.component.html',
  styleUrls: ['./chart-column-line-combine.component.scss']
})
export class ChartColumnLineCombineComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() container: string;
  @Input() unit: string;
  @Input() data: any;
  @Input() currentTimePoint: any;
  @Input() categories: any[];
  @Input() formater: any;

  private _chart: any;

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
      this.loadColumnLine(this.container, this.unit, this.data, this.categories, this.currentTimePoint, this.formater);
    }
  }

  updateChartData(data: any[]) {
    data.forEach((d, index) => {
      this._chart.series[index].update(d, false);
    });
    this._chart.redraw();
  }

  loadColumnLine(container, unit = '', data = [], categories = [], currentTimePoint = 1.5, formater = {}) {
    if (!data.length) {
      return;
    }

    // add default color for columns
    _.filter(data, {type: 'column'})
      .forEach((el, index) => {
        if (!el['color']) {
          el['color'] = COLOR_CODE[Object.keys(COLOR_CODE)[index]];
        }
      });

    const noOfMemberInGroup = _.filter(data, {type: 'column'}).length;
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

        yAxis: [{
          title: {
            text: 'Steam Demand',
            style: {
              'color': COLOR_CODE.WHITE
            }
          },

        }, {
          gridLineWidth: 0,
          lineWidth: 1,
          title: {
            text: 'Weather Forecast',
            style: {
              'color': COLOR_CODE.WHITE
            }
          },
          opposite: true
        }],

        tooltip: {
          formatter: function () {
            if (!!formater['toolTipFormater'] && !!formater['toolTipFormater'][this.series.name]) {
              return formater['toolTipFormater'][this.series.name].call(this, this.point);
            }
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
