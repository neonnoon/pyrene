/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-named-default */

// Sort alphabetically to find stuff easily
import { default as BarChartTable } from './components/BarChartTable/BarChartTable';
import { default as TimeSeriesPlayground } from './components/TimeSeriesPlayground/TimeSeriesPlayground';
import { default as Tooltip } from './components/TimeSeries/Tooltip';

// Sort alphabetically to find stuff easily
const Components = {
  BarChartTable,
  TimeSeriesPlayground,
  Tooltip,
};

// Sort alphabetically to find stuff easily
export { BarChartTable };
export { TimeSeriesPlayground };
export { Tooltip };

export default Components;
