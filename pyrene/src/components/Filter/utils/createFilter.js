/* eslint-disable import/prefer-default-export */

/*
 * Determines whether the value returned by a filter is to be ignored as it implies that the filter is not defined.
 */
export const isNullFilter = (type, value) => {
  switch (type) {
    case 'text':
      return value === null || value === '';
    case 'singleSelect':
      return !value;
    case 'multiSelect':
      return typeof value === 'undefined' || value.length === 0;
    default:
      return true;
  }
};

/*
 * Returns a function that filters datum.accessor for substrings (case-insensitive).
 */
export const getSubstringFunc = accessor => (value, datum) => typeof datum[accessor] !== 'undefined' && datum[accessor] !== null && datum[accessor].toString().toLowerCase().includes(value.toString().toLowerCase());

/*
 * Returns a function that filters datum.accessor for equal.
 */
export const getEqualFunc = accessor => (value, datum) => typeof datum[accessor] !== 'undefined' && datum[accessor] === value;

/*
 * Uses filter value and filter definition to create a filter based on accessor or customFilter.
 */
export const getSingleFilterFunc = (filterDefinition, filterValue) => (datum) => {
  switch (filterDefinition.type) {
    case 'text': {

      const filterFunc = filterDefinition.customFilter
        ? filterDefinition.customFilter
        : getSubstringFunc(filterDefinition.accessor);

      return filterFunc(filterValue, datum);
    }
    case 'singleSelect': {

      const filterFunc = filterDefinition.customFilter
        ? filterDefinition.customFilter
        : getEqualFunc(filterDefinition.accessor);

      return filterFunc(filterValue.value, datum);
    }
    case 'multiSelect': {
      const filterFunc = filterDefinition.customFilter
        ? filterDefinition.customFilter
        : getEqualFunc(filterDefinition.accessor);

      // Merges filterFunc by filter with or (starting with false), does at least one match?
      return filterValue.reduce((acc, currValue) => acc || filterFunc(currValue.value, datum), false);
    }
    default:
      return datum;
  }
};

/*
 * Merges all filter functions (per filter definition) into a combined function.
 */
export const getCombinedFilterFunc = (filterDefinitions, filterValues) => (datum) => {

  const filtersWithValues = filterDefinitions
    .filter(f => typeof filterValues[f.id] !== 'undefined')
    .filter(f => !isNullFilter(f.type, filterValues[f.id]));

  // Merges singleFilterFunc by filter with and (starting with true), do all match?
  const mergedFilter = filtersWithValues.reduce((acc, f) => acc && getSingleFilterFunc(f, filterValues[f.id])(datum), true);

  return mergedFilter;
};

export const filter = (filterDefinitions, filterValues, data) => {
  if (filterValues) {
    const combinedFilter = getCombinedFilterFunc(filterDefinitions, filterValues);
    return data.filter(datum => combinedFilter(datum));
  }
  return data;

};

/*
 * Goes through the data and gets the (unique) available options.
 */
export const getOptionsFromData = (optionsAccessors, data) => {
  // Find all {value: label:} in the data.
  const valueLabels = data.map((datum) => {
    const value = optionsAccessors.value(datum);
    const label = optionsAccessors.label(datum);

    return { value, label };
  });

  const uniqueValueLabels = valueLabels.filter((elem, pos, arr) => arr.findIndex(e => e.value === elem.value) === pos);
  return uniqueValueLabels;
};


/*
 * Derives filter options from definition (they're very similar).
 * Optionally uses data to derive the options.
 */
export const getFilterProps = (filterDefinitions, data) => filterDefinitions
  .filter(f => f.type !== null)
  .map(f => ({
    filterKey: f.id,
    label: f.label,
    type: f.type,
    options: f.options ? f.options : (f.optionsAccessors && data) ? getOptionsFromData(f.optionsAccessors, data) : undefined, // eslint-disable-line no-nested-ternary
    defaultValue: f.defaultValue,
  }));


/*
 * Creates a filter without data, returns filterProps and a function:
 * filterFunc(filterValues, data)
 */
export const createSimpleFilter = filterDefinitions => ({
  filterProps: getFilterProps(filterDefinitions),
  filterFunc: (filterValues, data) => filter(filterDefinitions, filterValues, data),
});

/*
 * Creates a filter based on data, returns filterProps and a function:
 * dataFilterFunc(filterValues)
 */
export const createDataFilter = (filterDefinitions, data) => ({
  filterProps: getFilterProps(filterDefinitions, data),
  dataFilterFunc: filterValues => filter(filterDefinitions, filterValues, data),
});
