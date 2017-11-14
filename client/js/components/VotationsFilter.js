'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_OFFSET
} from '../constants/commonConstants.js';
import {
  ALL, OWNER_ONLY, OWNER_PARTICIPATED
} from '../constants/votationsConstants.js';

import { 
  searchVotations,
  changeSearchVotationsValue
} from '../actions/votationsActions.js';
import {
  setPaginationOffset
} from '../actions/dataListActions.js';

import SearchBox from './SearchBox.js';

class VotationsFilter extends Component {
  render() {    
    return (
      <div className = 'votations-filter'>
        <form className = 'display-table' onSubmit = { this._onSearchSubmit.bind(this) }>
          <div className = 'votations-filter__sb-wrapper'>
          <input 
            className = 'sb' 
            type = 'search' 
            placeholder='Search votations...' 
            autoComplete = 'off'
            value = { this.props.searchVotationsValue }
            onChange = { this._onChange.bind(this)}
            
          ></input>
          
          </div>
          <div className = 'votations-filter__controls-wrapper text-right'>
            <select className = 'select-list'>
              <option value='All'>ALL</option>
              <option value='Owner'>{OWNER_ONLY}</option>
              <option value='Participated'>{OWNER_PARTICIPATED}</option>
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
  _onSearchSubmit(event) {
    event.preventDefault();

    this.props.setPaginationOffset(DEFAULT_PAGINATION_OFFSET);
    this.props.searchVotations({
      text: this.props.searchVotationsValue,
      limit: DEFAULT_PAGINATION_LIMIT,
      offset: DEFAULT_PAGINATION_OFFSET
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
    searchVotations: data => dispatch(searchVotations(data)),
    setPaginationOffset: offset => dispatch(setPaginationOffset(offset))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VotationsFilter);