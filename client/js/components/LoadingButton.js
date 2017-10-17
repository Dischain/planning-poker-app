'use strict';

import React, { Component } from 'react';

export default class LoadingButton extends Component {
  render() {
    return(
      <div>{this.props.btnText}</div>
    );
  }
}