'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ControllArea extends Component {
  render() {
    return (
      <div className = 'form__field-wrapper'>
        <label className = 'form__field-label'>
          {this.props.fieldName}
        </label>
        <textarea className = 'form__field-textarea'
          value = {this.props.value}
          onChange = {this.props.onChange}
          autoCorrect = 'off' 
          autoCapitalize = 'off' 
          spellCheck = 'false' />
      </div>
    );
  }
}

ControllArea.prototypes = {
  fieldName: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}