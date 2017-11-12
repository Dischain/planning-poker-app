'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export default class VotationsFilter extends Component {
  render() {
    return (
      <div className = 'votations-filter'>
        <form className = 'display-table'>
          <div className = 'search-box'>
            <input className = 'votations-input' type='search' placeholder='Search votations...' autocomplete='off'></input>
          </div>
          <div className = 'filter text-right'>
            <select className = 'votations-select'>
              <option value='volvo'>Volvo</option>
              <option value='Skoda'>Skoda</option>
            </select>              
            <a className = 'votations-btn'>New</a>
          </div>            
        </form>
      </div>
    );
  }
}