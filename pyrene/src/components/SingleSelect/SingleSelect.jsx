import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import SelectStyle from './singleSelectCSS';
import './select.css';
import Loader from '../Loader/Loader';

const LoadingIndicator = () => <Loader />;

/**
 * Selects are used when the user has to make a selection from a list that is too large to show.
 */
const SingleSelect = (props) => {

  let options;
  if (props.options.length > 0) {
    options = props.sorted ? props.options.sort((a, b) => a.label.localeCompare(b.label)) : props.options;
  } else {
    options = props.sorted ? props.optionsWithGroup.map((o) => (o.options ? { label: o.label, options: o.options.sort((a, b) => a.label.localeCompare(b.label)) } : o)) : props.optionsWithGroup;
  }

  return (
    <div styleName={classNames('selectContainer', { disabled: props.disabled })}>
      {props.title && <div styleName={classNames('selectTitle', { required: props.required && !props.disabled })}>{props.title}</div>}

      {props.creatable
        ? (
          <CreatableSelect
            className="singleSelect"
            styles={SelectStyle}
            components={{ LoadingIndicator }}
            // Sets the internal value to "" in case of null or undefined
            getOptionValue={(option) => ((option.value !== null && typeof option.value !== 'undefined') ? option.value : '')}
            placeholder={props.placeholder}
            options={options}
            value={props.value}
            defaultValue={props.defaultValue}
            isClearable={props.clearable}
            isDisabled={props.disabled}
            isInvalid={props.invalid}
            isLoading={props.loading}
            // wrapping type and key into target so it better reflects the api that input event has (there is also event.target.name)
            onChange={(option) => props.onChange(option, { target: { type: 'singleSelect', name: props.name, value: option } })}
            onBlur={props.onBlur}
            onFocus={props.onFocus}
            name={props.name}
            id={props.name}
            inputId={props.name}
            autoFocus={props.autoFocus}

            maxMenuHeight={264}
            noOptionsMessage={() => 'no matches found'}
            formatCreateLabel={(inputValue) => `Create new tag "${inputValue}"`}

            isSearchable
            blurInputOnSelect
            escapeClearsValue
            captureMenuScroll
          />
        )
        : (
          <Select
            className="singleSelect"
            styles={SelectStyle}
            components={{ LoadingIndicator }}
            // Sets the internal value to "" in case of null or undefined
            getOptionValue={(option) => ((option.value !== null && typeof option.value !== 'undefined') ? option.value : '')}
            placeholder={props.placeholder}
            options={options}
            value={props.value}
            defaultValue={props.defaultValue}
            isClearable={props.clearable}
            isSearchable={props.searchable}
            isDisabled={props.disabled}
            isInvalid={props.invalid}
            isLoading={props.loading}
            onChange={(option) => props.onChange(option, { target: { type: 'singleSelect', name: props.name, value: option } })}
            onBlur={props.onBlur}
            onFocus={props.onFocus}
            name={props.name}
            id={props.name}
            inputId={props.name}
            autoFocus={props.autoFocus}

            maxMenuHeight={264}
            noOptionsMessage={() => 'no matches found'}

            blurInputOnSelect
            escapeClearsValue
            captureMenuScroll
          />
        )}

      {props.invalid && props.invalidLabel && !props.disabled
        ? (
          <div styleName="invalidLabel">
            <span className="pyreneIcon-errorOutline" styleName="errorIcon" />
            {props.invalidLabel}
          </div>
        )
        : (
          <>
            {props.helperLabel
              && (
                <div styleName="selectHelper">
                  {props.helperLabel}
                </div>
              )}
          </>
        )}

    </div>
  );
};

SingleSelect.displayName = 'Single Select';

SingleSelect.defaultProps = {
  autoFocus: false,
  placeholder: '',
  name: '',
  creatable: false,
  disabled: false,
  invalid: false,
  loading: false,
  required: false,
  searchable: false,
  sorted: true,
  clearable: false,
  options: [],
  optionsWithGroup: [],
  defaultValue: null,
  helperLabel: '',
  invalidLabel: '',
  title: '',
  value: null,
  onChange: () => null,
  onBlur: () => null,
  onFocus: () => null,
};

SingleSelect.propTypes = {
  /**
  * Focus an element when it mounts.
  */
  autoFocus: PropTypes.bool,
  /**
   * Whether the selection is clearable.
   */
  clearable: PropTypes.bool,
  /**
   * Whether the user can create new options.
   */
  creatable: PropTypes.bool,
  /**
   * Sets a preselected option.
   */
  defaultValue: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool, PropTypes.object]),
  }),
  /**
   * Disables any interaction with the component.
   */
  disabled: PropTypes.bool,
  /**
   * Sets a label below the input field to display additional information for the user.
   */
  helperLabel: PropTypes.string,
  /**
   * Sets the visual appearance, to signal that the input is invalid.
   */
  invalid: PropTypes.bool,
  /**
   * Sets the label displayed instead of the helperLabel when the input is invalid.
   */
  invalidLabel: PropTypes.string,
  /**
   * Displays a loading indicator inside of the input.
   */
  loading: PropTypes.bool,
  /**
   * Sets the html name property of the form element.
   */
  name: PropTypes.string,
  /**
   * Javascript event handler.
   */
  onBlur: PropTypes.func,
  /**
   * Event Handler. Param option: {value: , label:}
   */
  onChange: PropTypes.func,
  /**
    * Focus event handler, use this to dynamically fetch options.
    */
  onFocus: PropTypes.func,
  /**
   * Data input array. Type: [{ value: string (required), label: string (required), invalid: bool }]
   */
  options: PropTypes.arrayOf(PropTypes.shape({
    invalid: PropTypes.bool,
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool, PropTypes.object]),
  })),
  /**
   * Data input array for dropdown with groups
   * eg:
   * MCC (only option without heading)
   * -----------
   * Current crew (not selectable heading)
   * engineer 1 (selectable option)
   * engineer 2
   * -----------
   * All engineers
   * engineer 3
   * engineer 4
   */
  optionsWithGroup: PropTypes.arrayOf(PropTypes.shape({
    invalid: PropTypes.bool,
    label: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.arrayOf([PropTypes.string, PropTypes.number, PropTypes.bool, PropTypes.object]),
    })),
  })),
  /**
   * Sets the placeholder label.
   */
  placeholder: PropTypes.string,
  /**
   * Adds a visual indication to display that the field is required.
   */
  required: PropTypes.bool,
  /**
   * Whether the user is allowed to type to search elements. Ignored if creatable is set true.
   */
  searchable: PropTypes.bool,
  /**
   * Whether the options are automatically sorted by the label or not.
   */
  sorted: PropTypes.bool,
  /**
   * Sets the title above the input field.
   */
  title: PropTypes.string,
  /**
   * Sets the value of the input field. Same type as supplied options.
   */
  value: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool, PropTypes.object]),
  }),
};

export default SingleSelect;
