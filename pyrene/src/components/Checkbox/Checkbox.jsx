import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import SVG from 'react-svg-inline';

import './checkbox.css';

import iconNormal from './checkbox-blank.svg';
import iconNormalHover from './checkbox-hover.svg';
import iconSelected from './checkbox-selected.svg';
import iconSelectedHover from './checkbox-selected-hover.svg';
import iconInvalid from './checkbox-invalid.svg';
import iconInvalidHover from './checkbox-invalid-hover.svg';

const iconMap = {
  normal: {
    default: iconNormal,
    hover: iconNormalHover,
  },
  checked: {
    default: iconSelected,
    hover: iconSelectedHover,
  },
  invalid: {
    default: iconInvalid,
    hover: iconInvalidHover,
  },
};

const getCheckboxIcon = (options, hovered) => {
  const { checked, disabled, invalid } = options;
  const iconKey = !disabled && hovered ? 'hover' : 'default';
  let icon = iconMap.normal[iconKey];
  if (invalid) {
    icon = iconMap.invalid[iconKey];
  } else if (checked) {
    icon = iconMap.checked[iconKey];
  }
  return <SVG svg={icon} />;
};

/**
 * Checkboxes allow the user to select one or more items from a set.
 *
 * Checkboxes can also be used to turn an option on or off.
 */
class Checkbox extends Component {

  state = {
    hovered: false,
  };

  onMouseEnter = () => {
    this.setState({ hovered: true });
  };

  onMouseLeave = () => {
    this.setState({ hovered: false });
  };

  render() {
    const options = {
      checked: this.props.value,
      invalid: this.props.invalid && !this.props.value,
      disabled: this.props.disabled,
    };
    const rand = Math.floor(Math.random() * 1e10);
    return (
      <div
        styleName="checkboxContainer"
        id={this.props.name}
        onBlur={this.props.onBlur}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <input
          id={`checkbox_${this.props.label}_${rand}`}
          styleName="checkbox"
          type="checkbox"
          checked={this.props.value}
          onChange={!this.props.disabled ? this.props.onChange : () => {}}
          onClick={e => e.stopPropagation()}
          name={this.props.name}
        />

        <label
          className="unSelectable"
          styleName={
            classNames('checkboxLabel', { disabled: this.props.disabled, required: this.props.required })}
          htmlFor={`checkbox_${this.props.label}_${rand}`}
          role="checkbox"
          aria-checked={this.props.value}
        >
          <span styleName="checkboxIcon">
            {getCheckboxIcon(options, this.state.hovered)}
          </span>
          {this.props.label}
        </label>
      </div>
    );
  }

}

Checkbox.displayName = 'Checkbox';

Checkbox.defaultProps = {
  disabled: false,
  value: false,
  invalid: false,
  required: false,
  name: '',
  label: '',
  onChange: () => null,
  onBlur: () => null,
};

Checkbox.propTypes = {
  /**
   * Disables any interaction with the component.
   */
  disabled: PropTypes.bool,
  /**
   * Sets the visual appearance, to signal that the input is invalid.
   */
  invalid: PropTypes.bool,
  /**
   * Sets the label displayed to the user.
   */
  label: PropTypes.string,
  /**
   * Sets the html name property of the form element.
   */
  name: PropTypes.string,
  /**
   * Javascript event handler.
   */
  onBlur: PropTypes.func,
  /**
   * Javascript event handler.
   */
  onChange: PropTypes.func,
  /**
   * Adds a visual indication to display that the field is required.
   */
  required: PropTypes.bool,
  /**
   * Sets whether the checkbox is checked.
   */
  value: PropTypes.bool,
};

export default Checkbox;