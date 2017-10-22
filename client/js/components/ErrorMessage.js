'use strict';

import React, { Component } from 'react';

export default class ErrorMessage extends Component {
  render() {
    return (
      this.props.errorMessage ? (
        <div className = 'error-wrapper'>
          <p className = 'error'>{this.props.errorMessage}</p>
        </div>
      ) : (
        <div></div>
      )
    );
  }
}