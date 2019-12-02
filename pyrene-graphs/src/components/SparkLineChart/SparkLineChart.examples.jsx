import moment from 'moment-timezone';
import { format } from 'd3-format';
import timeSeriesData from '../../examples/timeSeriesData';

const examples = {};

const yUnit = 'B';
const timezone = 'Asia/Shanghai';
const initialFrom = moment.tz('2019-10-01 00:00', timezone).valueOf();
const initialTo = moment.tz('2019-10-08 00:00', timezone).valueOf();
const initialDataSeries = timeSeriesData.genDownloadedVolumes(initialFrom, initialTo, 42);

const dataFormat = (num) => {
  const formattedNum = `${format('~s')(num)}`;
  if (num > 0.001 && num < 1000) {
    return `${parseFloat(formattedNum).toFixed(2)} ${yUnit}`;
  }
  return `${parseFloat(formattedNum.substring(0, formattedNum.length - 2)).toFixed(2)} ${formattedNum.substring(formattedNum.length - 1, formattedNum.length)}${yUnit}`;
};

examples.props = {
  bigNumber: initialDataSeries.data.map((d) => d[1]).reduce((a, b) => a + b),
  dataFormat: (d) => dataFormat(d * 100000000),
  dataSeries: initialDataSeries,
  axisLabel: 'DOWNLOADED VOLUME LAST 7 DAYS',
  timezone: timezone,
};

examples.category = 'Chart';

export default examples;
