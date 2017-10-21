'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ControlledInput extends Component {
  render() {
    return (
      <div className = 'form__field-wrapper'>
        <label className = 'form__field-label' 
          htmlFor = {this.props.formId}>{this.props.fieldName}</label>
        <input className = 'form__field-input'
          type = {this.props.type}
          id = {this.props.formId}
          value = {this.props.value}
          placeholder = {this.props.placeholder}
          onChange = {this.props.onChange}
          autoCorrect = 'off' 
          autoCapitalize = 'off' 
          spellCheck = 'false' />
        <div className = 'form__field-error'>{this.props.errorMessage}</div>
      </div>
    );
  }
}

ControlledInput.prototypes = {
  formId: PropTypes.string.isRequired,
  fieldName: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  errorMessage: PropTypes.string
}