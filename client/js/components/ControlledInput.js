'use strict';

import React, { Component } from 'react';

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