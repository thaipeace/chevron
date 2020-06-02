import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {COLOR_CODE} from '@shared/constants/color.constant';

const Highcharts = require('highcharts');

@Component({
  selector: 'app-chart-gauge',
  templateUrl: './chart-gauge.component.html',
  styleUrls: ['./chart-gauge.component.scss']
})
export class ChartGaugeComponent implements OnInit, OnChanges {
  @Input() name: string = '';
  @Input() title: string = '';
  @Input() unit: string = '';
  @Input() current: number = 0;
  @Input() min: number = 0;
  @Input() max: number = 100;
  @Input() random: boolean = true;

  gaugeChart;

  constructor() {

  }

  ngOnChanges() {
  }

  ngOnInit() {
    const self = this;
    if (self.name) {
      setTimeout(function () {
  
        self.loadGauge(self.title, self.name, self.unit, self.current
          , self.min, self.max, self.random);
      }, 2000);
    }
  }

  loadGauge(title: string, container: string, unit: string, data: number, min: number,
            max: number, random: boolean) {
    const self = this;
    self.gaugeChart = Highcharts.chart(container, {
      chart: {
        type: 'solidgauge',
        backgroundColor: 'transparent'
      },
      title: null,
      yAxis: {
        min: min,
        max: max,
        title: {
          text: title + (unit ? ` (${unit})` : ''),
          style: {'font-size': '12px', 'font-family': 'Roboto', 'color': '#fff'},
          y: -50
        },
        stops: [
          [0.5, COLOR_CODE.BLUE_1],
          [1, COLOR_CODE.BLUE_2],
        ],
        lineWidth: 0,
        minorTickInterval: null,
        tickAmount: 2,
        labels: {
          y: 16,
          distance: -13,
          style: {
            'color': '#fff'
          }
        }
      },
      tooltip: {
        enabled: false
      },
      pane: {
        center: ['50%', '90%'],
        size: '130%',
        startAngle: -90,
        endAngle: 90,
        background: {
          backgroundColor: '#EEE',
          innerRadius: '65%',
          outerRadius: '100%',
          borderColor: 'transparent',
          shape: 'arc'
        }
      },

      credits: {
        enabled: false
      },

      plotOptions: {
        solidgauge: {
          innerRadius: '65%',
          //outerRadius: '90%',
          dataLabels: {
            y: 5,
            borderWidth: 0,
            useHTML: true
          }
        }
      },

      series: [{
        name: title,
        data: [parseInt((data * 100) + '') / 100.0],
        dataLabels: {
          format: `
        <div style="text-align:center;color: white;" >
        <span style="font-size:14px;font-family:'Roboto';font-weight: normal;"
        >
        {y}</span><br/></div>
        `
        },
        tooltip: {
          valueSuffix: ' ' + unit
        }
      }]

    });

    if (random) {
      setInterval(function () {
        // Speed
        var point,
          newVal,
          inc;

        if (self.gaugeChart) {
          point = self.gaugeChart.series[0].points[0];
          inc = Math.round((Math.random() - 0.5) * max / 2);
          newVal = point.y + inc;

          if (newVal < 0 || newVal > max) {
            newVal = point.y - inc;
          }

          point.update(newVal);
        }

      }, 5000);

    }

  }

}

