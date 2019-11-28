import React from 'react';
import { Bar, RelativeBar, Responsive } from 'tuktuktwo';
import './barChartTable.css';

const getId = (d) => d.trim().toLowerCase();

export const getValueWithAccessor = (row, accessor) => (typeof accessor === 'string' ? row[accessor] : accessor(row));

const getColumn = ({
  id, accessor, accessorSecondary, headerName, formatter = (d) => d, align, width, linkAccessor, cellType, colors, maxValue, labelAccessor,
}) => {
  const barWeightPrimary = 6;
  const barWeightSecondary = 4;
  const comparisonMargin = 6;
  return {
    id: getId(id),
    accessor: accessor,
    headerName: headerName,
    align: align,
    maxWidth: width,
    cellRenderCallback: {
      link: linkAccessor ? (row) => ( // eslint-disable-line react/display-name
        <a
          styleName="labelLink"
          href={getValueWithAccessor(row, linkAccessor)}
        >
          {row.value}
        </a>
      ) : (row) => formatter(row.value),
      relativeBar: (row) => ( // eslint-disable-line react/display-name
        <Responsive styleName="responsiveContainer">
          {(parent) => (
            <svg width={parent.width} height={barWeightPrimary}>
              <RelativeBar
                barWeight={barWeightPrimary}
                colors={colors}
                maxValue={maxValue}
                value={getValueWithAccessor(row, accessor)}
                size={parent.width}
                direction="horizontal"
              />
            </svg>
          )}
        </Responsive>
      ),
      relativeBarMirrored: (row) => ( // eslint-disable-line react/display-name
        <Responsive styleName="responsiveContainer">
          {(parent) => (
            <svg width={parent.width} height={barWeightPrimary}>
              <RelativeBar
                barWeight={barWeightPrimary}
                colors={colors}
                maxValue={maxValue}
                value={getValueWithAccessor(row, accessor)}
                size={parent.width}
                direction="horizontal"
                mirrored
              />
            </svg>
          )}
        </Responsive>
      ),
      verticalLine: () => ( // eslint-disable-line react/display-name
        <div styleName="verticalLine" />
      ),
      comparisonBars: (row) => ( // eslint-disable-line react/display-name
        <Responsive styleName="responsiveContainer">
          {(parent) => (
            <svg width={parent.width} height={barWeightPrimary + comparisonMargin + barWeightSecondary}>
              <Bar
                key={`${getId(getValueWithAccessor(row, labelAccessor))}_bar_current`} // eslint-disable-line
                barWeight={barWeightPrimary}
                color={colors[0]}
                maxValue={maxValue}
                value={getValueWithAccessor(row, accessor)} // eslint-disable-line
                size={parent.width}
                direction="horizontal"
              />
              <Bar
                key={`${getId(getValueWithAccessor(row, labelAccessor))}_bar_previous`} // eslint-disable-line
                barWeight={barWeightSecondary}
                color={colors[1]}
                maxValue={maxValue}
                value={getValueWithAccessor(row, accessorSecondary)} // eslint-disable-line
                size={parent.width}
                direction="horizontal"
                y={barWeightPrimary + comparisonMargin}
              />
            </svg>
          )}
        </Responsive>
      ),
      default: (row) => formatter(row.value),
    }[cellType || 'default'],
  };
};

export const getLegend = (type, columns) => {
  switch (type) {
    case 'comparison':
      return [columns.primaryValue.title, columns.secondaryValue.title];
    default:
      return [];
  }
};

export const getColumns = ({
  props,
  colors,
  width,
}) => {
  const maxValuePrimary = Math.max(...props.data.map((dataRow) => getValueWithAccessor(dataRow, props.columns.primaryValue.accessor)));
  const maxValueSecondary = props.columns.secondaryValue ? Math.max(...props.data.map((dataRow) => getValueWithAccessor(dataRow, props.columns.secondaryValue.accessor))) : maxValuePrimary;
  const maxValue = Math.max(maxValuePrimary, maxValueSecondary);
  const hasColumnSecondaryLabel = !!props.columns.secondaryLabel;
  const hasColumnSecondaryValue = !!props.columns.secondaryValue;
  const margin = 16;
  const marginLeftRight = 8;
  const valueColumnWidthDefault = 64;
  const secondaryLabelColumnWidthDefault = 32;

  const primaryValueColumnWidth = props.columns.primaryValue.width ? props.columns.primaryValue.width : valueColumnWidthDefault;
  const secondaryValueColumnWidth = hasColumnSecondaryValue && (props.columns.secondaryValue.width ? props.columns.secondaryValue.width : valueColumnWidthDefault);
  const secondaryLabelColumnWidth = hasColumnSecondaryLabel && (props.columns.secondaryLabel.width ? props.columns.secondaryLabel.width : secondaryLabelColumnWidthDefault);
  const valueColumnWidthDouble = primaryValueColumnWidth + margin + secondaryValueColumnWidth;

  switch (props.type) {
    case 'bar': {
      // responsive width = 100% - value columns on the right - all margins = label and bar columns
      // marginLeft {LABEL1 + MARGIN + LABEL2} margin BAR margin value1 margin value2 marginRight
      const responsiveWidth = (width - marginLeftRight - margin - margin - primaryValueColumnWidth - margin - secondaryValueColumnWidth - marginLeftRight) / 2;
      const secondaryLabelWidth = hasColumnSecondaryLabel ? secondaryLabelColumnWidth + margin : 0;
      return [
        getColumn({
          id: props.title,
          accessor: props.columns.label.accessor,
          linkAccessor: props.columns.label.linkAccessor,
          align: 'left',
          cellType: 'link',
          width: `${responsiveWidth - secondaryLabelWidth}px`,
        }),
        ...(hasColumnSecondaryLabel ? [getColumn({
          id: props.columns.secondaryLabel.title,
          accessor: props.columns.secondaryLabel.accessor,
          headerName: props.columns.secondaryLabel.title,
          align: 'right',
          width: `${secondaryLabelColumnWidth}px`,
        })] : []),
        ...((!width && width !== 0) ? [] : [getColumn({
          id: `${props.columns.primaryValue.title}_bar`,
          accessor: props.columns.primaryValue.accessor,
          headerName: props.columns.primaryValue.title,
          cellType: 'relativeBar',
          colors: colors,
          maxValue: maxValue,
          width: `${responsiveWidth + (hasColumnSecondaryValue ? 0 : secondaryValueColumnWidth + margin)}px`,
        })]),
        getColumn({
          id: props.columns.primaryValue.title,
          accessor: props.columns.primaryValue.accessor,
          formatter: props.columns.primaryValue.formatter,
          headerName: (!width && width !== 0) ? props.columns.primaryValue.title : '',
          align: 'right',
          width: `${primaryValueColumnWidth}px`,
        }),
        ...(hasColumnSecondaryValue ? [getColumn({
          id: props.columns.secondaryValue.title,
          accessor: props.columns.secondaryValue.accessor,
          formatter: props.columns.secondaryValue.formatter,
          headerName: props.columns.secondaryValue.title,
          align: 'right',
          width: `${secondaryValueColumnWidth}px`,
        })] : []),
      ];
    }
    case 'comparison':
      if (props.columns.secondaryValue) {
        // responsive width = 100% - value columns on the right - all margins = label and bar columns
        // marginLeft LABEL1 margin BAR margin value1 margin value2 marginRight
        const responsiveWidth = (width - marginLeftRight - margin - margin - primaryValueColumnWidth - margin - secondaryValueColumnWidth - marginLeftRight) / 2;
        return [
          getColumn({
            id: props.title,
            accessor: props.columns.label.accessor,
            linkAccessor: props.columns.label.linkAccessor,
            align: 'left',
            cellType: 'link',
            width: `${responsiveWidth}px`,
          }),
          ...((!width && width !== 0) ? [] : [getColumn({
            id: `${props.columns.primaryValue.title}_bar`,
            accessor: props.columns.primaryValue.accessor,
            accessorSecondary: props.columns.secondaryValue.accessor,
            cellType: 'comparisonBars',
            colors: colors,
            maxValue: maxValue,
            labelAccessor: props.columns.label.accessor,
            width: `${responsiveWidth}px`,
          })]),
          getColumn({
            id: props.columns.primaryValue.title,
            accessor: props.columns.primaryValue.accessor,
            formatter: props.columns.primaryValue.formatter,
            headerName: props.columns.primaryValue.title,
            align: 'right',
            width: `${primaryValueColumnWidth}px`,
          }),
          getColumn({
            id: props.columns.secondaryValue.title,
            accessor: props.columns.secondaryValue.accessor,
            formatter: props.columns.secondaryValue.formatter,
            headerName: props.columns.secondaryValue.title,
            align: 'right',
            width: `${secondaryValueColumnWidth}px`,
          }),
        ];
      } throw Error('Missing secondary value');
    case 'butterfly':
      if (props.columns.secondaryValue) {
        const verticalLineWidth = 1;
        // responsive width = (100% - value columns - all margins) / 3 = label and bars column width
        // marginLeft {LABEL + MARGIN + VALUE1} margin BAR margin value2 marginRight
        // value2 is twice as big to align with bar charts
        const responsiveWidthLabel = ((width - marginLeftRight - margin - margin - valueColumnWidthDouble - marginLeftRight) / 2) - margin - primaryValueColumnWidth;
        // marginLeft responsiveWidthLabel margin BAR1 margin verticalLine margin BAR2 margin value2 marginRight
        const responsiveWidthBar = (width - marginLeftRight - responsiveWidthLabel - margin - margin - verticalLineWidth - margin - margin - valueColumnWidthDouble - marginLeftRight) / 2;
        return [
          getColumn({
            id: props.title,
            accessor: props.columns.label.accessor,
            linkAccessor: props.columns.label.linkAccessor,
            align: 'left',
            cellType: 'link',
            width: `${responsiveWidthLabel}px`,
          }),
          getColumn({
            id: props.columns.primaryValue.title,
            accessor: props.columns.primaryValue.accessor,
            formatter: props.columns.primaryValue.formatter,
            headerName: (!width && width !== 0) ? props.columns.primaryValue.title : '',
            align: 'right',
            width: `${primaryValueColumnWidth}px`,
          }),
          ...((!width && width !== 0) ? [] : [getColumn({
            id: `${props.columns.primaryValue.title}_bar_left`,
            accessor: props.columns.primaryValue.accessor,
            headerName: props.columns.primaryValue.title,
            align: 'right',
            cellType: 'relativeBarMirrored',
            colors: colors,
            maxValue: maxValue,
            width: `${responsiveWidthBar}px`,
          })]),
          ...((!width && width !== 0) ? [] : [getColumn({
            id: `${props.columns.primaryValue.title}_vertical_line`,
            accessor: props.columns.primaryValue.accessor,
            align: 'center',
            cellType: 'verticalLine',
            width: `${verticalLineWidth}px`,
          })]),
          ...((!width && width !== 0) ? [] : [getColumn({
            id: `${props.columns.secondaryValue.title}_bar_right`,
            headerName: props.columns.secondaryValue.title,
            accessor: props.columns.secondaryValue.accessor,
            align: 'left',
            colors: colors,
            maxValue: maxValue,
            cellType: 'relativeBar',
            width: `${responsiveWidthBar}px`,
          })]),
          getColumn({
            id: props.columns.secondaryValue.title,
            accessor: props.columns.secondaryValue.accessor,
            formatter: props.columns.secondaryValue.formatter,
            headerName: (!width && width !== 0) ? props.columns.secondaryValue.title : '',
            align: 'right',
            width: `${secondaryValueColumnWidth}px`,
          }),
        ];
      } throw Error('Missing secondary value');
    default:
      throw Error('Unknown type');
  }
};
