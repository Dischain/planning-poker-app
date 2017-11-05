'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class SearchBox extends Component {
  render() {
    return (
      <div className = 'search-box nav__item'>
        <form onSubmit = {this.props.onSubmit}>
          <input
            style = {this.props.style}
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
          
        </form>
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
  onSubmit: PropTypes.func.isRequired,
  style: PropTypes.object.isRequired
}