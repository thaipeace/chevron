import {Subject} from 'rxjs';
import {Component, Input, OnInit, OnChanges, SimpleChanges, AfterViewInit} from '@angular/core';
import {COLOR_CODE} from '@shared/constants/color.constant';
import {IChartMeterViewModel} from '@shared/models/chart-meter.viewmodel';

const Highcharts = require('highcharts');

@Component({
  selector: 'app-chart-meter',
  templateUrl: './chart-meter.component.html',
  styleUrls: ['./chart-meter.component.scss']
})
export class ChartMeterComponent implements AfterViewInit {
  @Input() name: string = '';
  @Input() title: string = '';
  @Input() subtitle: string;
  @Input() color: string = null;
  @Input() unit: string = 'Litres';
  @Input() min: number = 0;
  @Input() max: number = 100;
  @Input() value: number = 50;
  @Input() random: boolean = true;
  @Input() valueName: string = '';
  @Input() plotBandRange: number[][];
  @Input() reload$: Subject<IChartMeterViewModel>;

  gaugeChart;

  constructor() {
  }

  ngAfterViewInit(): void {
    const self = this;
    setTimeout(() => {
      self.loadChart(self.name, self.title, self.min, self.max, self.value, self.unit, self.color);
      if (!!self.reload$) {
        self.reload$.subscribe((chartData: IChartMeterViewModel) => {
          if (!!chartData) {
            self.name = chartData.name;
            self.title = chartData.title;
            self.unit = chartData.unit;
            self.min = chartData.min;
            self.max = chartData.max;
            self.value = chartData.value;
            self.random = chartData.random;
            self.color = chartData.color;
            self.loadChart(self.name, self.title, self.min, self.max, self.value, self.unit, self.color);
          }
        });
      }
    });
  }

  loadChart(name, title, min, max, value, unit, color) {
    const self = this;

    function callback(chart) {
      if (!chart.renderer.forExport && self.random) {
        setInterval(function () {
          var point = chart.series[0].points[0],
            newVal,
            inc = Math.round((Math.random() - 0.5) * 20);

          newVal = point.y + inc;
          if (newVal < 0 || newVal > 100) {
            newVal = point.y - inc;
          }

          point.update(newVal);

        }, 3000);
      }
    }

    self.gaugeChart = Highcharts.chart(name,
      {
        chart: {
          renderTo: name,
          type: 'gauge',
          backgroundColor: 'transparent',
          spacingTop: 10,
          spacingBottom: 50
        },
        credits: {
          enabled: false
        },
        title: {
          text: title,
          y: 200,
          style: {
            'font-size': '1.2rem',
            'font-weight': 'bold',
            'color': color,
            'height': '50px'
          }
        },
        pane: {
          startAngle: -150,
          endAngle: 150,
          size: '100%',
          background: {
            backgroundColor: 'transparent',
            outerRadius: '100%',
            borderColor: 'transparent',
            shape: 'arc'
          }
        },
        yAxis: {
          min: min,
          max: max,
          minorTickWidth: 0,
          tickWidth: 0,
          lineWidth: 0,
          labels: {
            step: 2,
            rotation: 'auto',
            style: {
              'color': COLOR_CODE.BLUE_WILD,
              'fontSize': '9px'
            },
            distance: -20
          },
          title: {
            text: unit,
            style: {
              'fontSize': '10px',
              'color': COLOR_CODE.BLUE_WILD
            },
            y: 10
          },
          plotBands: this.getPlotBands(),
        },
        plotOptions: {
          gauge: {
            dial: {
              backgroundColor: COLOR_CODE.BLUE_WILD,
              rearLength: '15%'
            },
            pivot: {
              backgroundColor: COLOR_CODE.BLUE_WILD
            },
          }
        },
        series: [{
          name: this.valueName,
          // data: [Math.round(value * 100) / 100],
          data: [value],
          dataLabels: {
            borderWidth: 0,
            borderColor: 'transparent',
            padding: 5,
            style: {
              color: '#ffffff',
              'fontSize': '14px',
              'fontWeight': 'normal',
              'visibility': 'visible',
              'opacity': '1'
            },
            y: 5
          },
          tooltip: {
            valueSuffix: ` ${unit}`
          }
        }]
      }, callback);
  }

  getPlotBands(): any[] {
    if (!!this.plotBandRange) {
      const colors = [COLOR_CODE.METER.DANGER, COLOR_CODE.METER.MEDIUM, COLOR_CODE.METER.GOOD, COLOR_CODE.METER.MAX];
      return this.plotBandRange.map((setting: number[], index: number) => {
        return {
          from: setting[0],
          to: setting[1],
          thickness: '12%',
          color: colors[index],
        };
      });
    } else {
      const max = this.max;
      return [{
        from: 0,
        to: max / 3,
        thickness: '12%',
        color: COLOR_CODE.METER.DANGER,
      }, {
        from: max / 3,
        to: max / 3 * 2,
        thickness: '12%',
        color: COLOR_CODE.METER.MEDIUM
      }, {
        from: max / 3 * 2,
        to: max * 0.9,
        thickness: '12%',
        color: COLOR_CODE.METER.GOOD
      }, {
        from: max * 0.9,
        to: max,
        thickness: '12%',
        color: COLOR_CODE.METER.MAX
      }];
    }
  }
}
