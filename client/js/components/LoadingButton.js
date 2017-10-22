'use strict';

import React, { Component } from 'react';
import LoadingIndicator from './LoadingIndicator.js';

export default class LoadingButton extends Component {
  render() {
    return(
      <div className={this.props.className + " btn btn--loading"}>
        <LoadingIndicator />
      </div>
    );
  }
}