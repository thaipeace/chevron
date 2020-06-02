import { Component, OnInit, OnChanges, AfterViewInit, Input, SimpleChanges } from '@angular/core';
import { COLOR_CODE } from '@app/shared/constants/color.constant';
import * as _ from 'lodash';
import { IChartColumnLineDailyModel } from './chart-column-line-daily.model';
// import { ScrollbarService } from '@app/shared/services/scrolling.service';

const Highcharts = require('highcharts');
@Component({
  selector: 'app-chart-column-line-daily',
  templateUrl: './chart-column-line-daily.component.html',
  styleUrls: ['./chart-column-line-daily.component.scss']
})
export class ChartColumnLineDailyComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() container: string;
  @Input() unit: string;
  @Input() data: IChartColumnLineDailyModel;
  @Input() currentTimePoint: any;
  @Input() categories: any[];
  @Input() formater: any;
  @Input() yAxisTitle: string;

  private _chart: any;

  constructor(
    // private scrollbarService: ScrollbarService
  ) { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    const { data } = changes;
    if (!!data && !!data.currentValue && data.currentValue.columns.length > 0) {
      if (!data.firstChange) {
        this.updateChartData(this.data, this.unit);
      }
    }
  }

  ngAfterViewInit() {
    if (!!this.data) {
      setTimeout(() => {
        this.loadColumnLine(this.container, this.unit, this.data, this.categories, this.formater);
      }, 1000);
    }
  }

  updateChartData(data: IChartColumnLineDailyModel, unit: string) {
    const seriesData = this.convertToSeriesData(data, unit);
    const currentSeries = this._chart.series.length;
    for (let index = 0; index < currentSeries; index++) {
      this._chart.series[0].remove(false);
    }
    for (let index = 0; index < seriesData.length; index++) {
      this._chart.addSeries(seriesData[index], false);
    }
    this._chart.xAxis[0].setCategories(this.categories, false);

    const noOfMemberInGroup = seriesData.length;
    const noOfGroup = this.categories.length;
    const colWidth = 50;

    this._chart.update({
      chart: {
        scrollablePlotArea: {
          minWidth: noOfGroup * noOfMemberInGroup * colWidth,
        }
      },
  });

    this._chart.redraw();
  }

  loadColumnLine(container: string, unit: string = '', data: IChartColumnLineDailyModel, categories: string[] = [], formater = {}) {
    if (!data || !data.columns) {
      return;
    }

    const noOfMemberInGroup = data.columns.length;
    const noOfGroup = categories.length;

    const colWidth = 50;

    const chartConfig = {
      renderTo: container,
      type: 'column',
      scrollablePlotArea: {
        minWidth: noOfGroup * noOfMemberInGroup * colWidth,
      }
    };

    const defaultColors = ['#ff5d6a', '#ffe600', '#c19669', '#2496c9', '#2496c9', '#2496c9', '#2496c9', '#2496c9'];

    data.columns.forEach((col, index: number) => {
      if (!col.color) {
        col.color = defaultColors[index];
      }
    });

    const seriesData = this.convertToSeriesData(data, unit);

    this._chart = Highcharts.chart({
      chart: chartConfig,
      xAxis: {
        type: 'category',
        categories: categories,
        title: {
          text: null
        },
      },
      plotOptions: {
        column: {
          pointPadding: 0,
        },
        series: {
          pointPadding: 0,
          borderWidth: 0,
        }
      },
      series: seriesData
    });

    // this.refreshSize(chartConfig.scrollablePlotArea.minWidth, 350);
  }

  refreshSize(newWidth, newHeight) {
    if (!!this._chart) {
      this._chart.setSize(newWidth, newHeight);
    }
  }

  convertToSeriesData(data, unit) {
    return data.columns.map(column => {
      return {
        name: column.name,
        type: 'column',
        // yAxis: 0,
        data: column.data,
        color: column.color,
        tooltip: {
          valueSuffix: ` ${unit}`
        }
      };
    });
  }
}
