'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class SearchBox extends Component {
  render() {
    return (
      <div>
        <input
          type = {this.props.type}
          id = {this.props.formId}
          value = {this.props.value}
          placeholder = {this.props.placeholder}
          onChange = {this.props.onChange}
          onSubmit = {this.props.onSubmit}
          autoCorrect = 'off' 
          autoCapitalize = 'off'  
          spellCheck = 'false'
        />
        <button
          onClick = {this.props.onSubmit}
        >  
        </button>
      </div>
    );
  }
}

SearchBox.prototypes = {
  formId: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
}