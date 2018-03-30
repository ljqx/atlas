/* eslint-disable class-methods-use-this */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactEcharts from 'echarts-for-react';
import _ from 'lodash';

const getMetric2TypeMap = AxisMetrics => _.reduce(AxisMetrics, (memo, axis, index) => {
  _.each(axis.metrics, (metric) => {
    memo[metric] = { //eslint-disable-line
      index,
      type: axis.type,
    };
  });
  return memo;
}, {});

export default class LineBarChart extends PureComponent { //eslint-disable-line
  getSource() {
    const {
      source,
    } = this.props.value;
    if (_.isNil(source)) {
      throw new Error('Chart source is nil');
    }

    return _.map(source, s => _.defaults(
      {},
      _.isString(s.timestamp) ? { timestamp: s.timestamp.replace('T00:00:00Z', '').replace('T00:00:00.000Z', '') } : {},
      s,
    ));
  }
  /**
   * xAxis: month
   * yAxis: [{
   *   metrics: ['targetRevenue', 'forecastRevenue'],
   *   type: 'bar'
   * }, {
   *   metrics: ['cumulativeTargetRevenue', 'cumulativeForecast'],
   *   type: 'line',
   * },
   *  source: [{}, {}]
   * ]
   */

  getDimensions() {
    return _.chain(this.getSource())
      .first()
      .keys()
      .value();
  }

  getMetricDimensions() {
    return _.isEmpty(this.props.value.metricDimensions) ?
      _.difference(this.getDimensions(), [this.props.value.xAxisMetric]) :
      this.props.value.metricDimensions;
  }

  render() {
    const source = this.getSource();

    if (_.isEmpty(source)) {
      return null;
    }
    const { xAxisMetric, yAxisMetrics } = this.props.value;
    const metric2TypeMap = getMetric2TypeMap(yAxisMetrics);

    const options = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
      },
      xAxis: [{
        type: 'category',
        data: _.map(source, row => _.result(row, xAxisMetric)),
        axisPointer: {
          type: 'shadow',
        },
      }],
      yAxis: _.map(yAxisMetrics, metric => ({
        type: 'value',
        name: metric,
      })),
      series: _.map(this.getMetricDimensions(), series => ({
        name: series,
        type: metric2TypeMap[series].type,
        data: _.map(source, row => _.result(row, series)),
        yAxisIndex: metric2TypeMap[series].index,
      })),
    };
    return (
      <ReactEcharts
        theme="theme1"
        option={options}
        notMerge={true} //eslint-disable-line
        {...this.props}
      />
    );
  }
}

LineBarChart.propTypes = {
  value: PropTypes.objectOf(PropTypes.any).isRequired,
  title: PropTypes.string,
};

LineBarChart.defaultProps = {
  title: '',
};