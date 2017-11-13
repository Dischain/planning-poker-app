'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  DEFAULT_PAGINATION_LIMIT
} from '../constants/commonConstants.js';

import { 
  searchVotations,
  changeSearchVotationsValue
} from '../actions/votationsActions.js';
import SearchBox from './SearchBox.js';

class VotationsFilter extends Component {
  render() {    
    return (
      <div className = 'votations-filter'>
        <form className = 'display-table' onSubmit = { (e) => e.preventDefault() }>
          <div className = 'votations-filter__sb-wrapper'>
          <input 
            className = 'sb' 
            type = 'search' 
            placeholder='Search votations...' 
            autoComplete = 'off'
            value = { this.props.searchVotationsValue }
            onChange = { this._onChange.bind(this)}
            onClick = { this._onClick.bind(this) }             
          ></input>
          
          </div>
          <div className = 'votations-filter__controls-wrapper text-right'>
            <select className = 'select-list'>
              <option value='All'>All</option>
              <option value='Owner'>Owner</option>
              <option value='Participated'>Participated</option>
            </select>
            <div className = 'btn'>
              <a >New</a>
            </div>
          </div>            
        </form>
      </div>
    )
  }

  _onChange(event) {
    event.preventDefault();

    this.props.changeSearchVotationsValue(event.target.value);    
  }
  _onClick(event) {
    event.preventDefault();

    this.props.searchVotations({
      text: this.props.searchVotationsValue,
      limit: DEFAULT_PAGINATION_LIMIT,
      offset: 0
    });
  }
}

function mapStateToProps({ dataListReducer }) {
  return {
    searchVotationsValue: dataListReducer.searchVotationsValue    
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch: func => dispatch(func),
    changeSearchVotationsValue: value => dispatch(changeSearchVotationsValue(value)),
    searchVotations: data => dispatch(searchVotations(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VotationsFilter);